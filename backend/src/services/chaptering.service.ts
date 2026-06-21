import { z } from 'zod';
import { chatCompletion } from './ai.service';

export interface TranscriptSegmentInput {
  start: number;
  end: number;
  text: string;
}

export interface Chapter {
  title: string;
  summary: string;
  startTime: number;
  endTime: number;
}

// What we ASK the model for: an index, not a timestamp.
const chapterSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  startSegmentIndex: z.number().int().nonnegative(),
});

const chaptersResponseSchema = z.object({
  chapters: z.array(chapterSchema).min(1),
});

const SYSTEM_PROMPT = `You are an expert video editor who creates chapter markers for long-form video content.

You will be given a numbered list of transcript segments, each on its own line as "INDEX: TEXT". Identify natural topic boundaries in the conversation and group consecutive segments into between 4 and 10 chapters that together cover the entire video from start to end.

Respond with ONLY a JSON object in exactly this shape, and nothing else — no markdown fences, no explanation before or after:
{"chapters": [{"title": "short chapter title", "summary": "one to two sentence summary", "startSegmentIndex": 0}]}

Rules:
- "startSegmentIndex" must be the index of the segment where that chapter begins, taken directly from the provided list.
- The first chapter's startSegmentIndex must be 0.
- Chapters must be in increasing order of startSegmentIndex.
- Never invent an index outside the range you were given.`;

/**
 * Generates chapter markers by having the LLM choose semantic boundaries
 * from a segment list, then resolving the ACTUAL timestamps ourselves —
 * never trusting the model to do timestamp math.
 */
export async function generateChapters(
  segments: TranscriptSegmentInput[]
): Promise<Chapter[]> {
  const numberedTranscript = segments
    .map((seg, i) => `${i}: ${seg.text}`)
    .join('\n');

  const rawResponse = await chatCompletion(SYSTEM_PROMPT, numberedTranscript);

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawResponse);
  } catch {
    throw new Error('Model did not return valid JSON for chapter generation');
  }

  const validation = chaptersResponseSchema.safeParse(parsed);
  if (!validation.success) {
    // Throwing here triggers BullMQ's retry/backoff policy — an occasional
    // malformed response is treated as transient, not fatal.
    throw new Error(
      `Model response failed schema validation: ${validation.error.message}`
    );
  }

  const { chapters } = validation.data;

  // Defensive clamp: even past validation, an index could in theory exceed
  // the real segment count if the model ignored instructions. Clamp rather
  // than crash the entire job over one bad index.
  const clamped = chapters.map((ch) => ({
    ...ch,
    startSegmentIndex: Math.min(ch.startSegmentIndex, segments.length - 1),
  }));

  return clamped.map((chapter, i) => {
    const startSegment = segments[chapter.startSegmentIndex];
    const nextChapter = clamped[i + 1];
    const isLastChapter = i === clamped.length - 1;

    const endTime = isLastChapter
      ? segments[segments.length - 1].end
      : segments[nextChapter.startSegmentIndex].start;

    return {
      title: chapter.title,
      summary: chapter.summary,
      startTime: startSegment.start,
      endTime,
    };
  });
}