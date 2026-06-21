import Groq from 'groq-sdk';
import fs from 'fs';

// ─── Groq client ────────────────────────────────────────────────────────────
// Groq's SDK is intentionally OpenAI-compatible. If you've used the OpenAI
// SDK before, this will look identical — same method names, same response
// shapes. That's by design: Groq exposes an OpenAI-compatible REST API, so
// swapping providers is a one-line change to the client instantiation.
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ─── TRANSCRIPTION (replaces OpenAI Whisper) ────────────────────────────────

export interface WhisperSegment {
  start: number;
  end: number;
  text: string;
}

export interface WhisperWord {
  word: string;
  start: number;
  end: number;
}

export interface WhisperVerboseResult {
  text: string;
  segments: WhisperSegment[];
  words: WhisperWord[];
}

/**
 * Transcribes audio via Groq's hosted Whisper Large v3 Turbo.
 *
 * Why Turbo over the full v3?
 * - whisper-large-v3-turbo runs at 228x real-time speed on Groq's LPUs
 * - Accuracy difference vs full v3 is negligible for clear speech
 * - It's the faster, cheaper option — and on the free tier, both are $0
 *
 * The API parameters are identical to OpenAI Whisper, because Groq
 * deliberately mirrors the OpenAI audio endpoint spec. Both segment-level
 * and word-level timestamp_granularities are supported on Groq.
 */
export async function transcribeAudio(
  audioFilePath: string
): Promise<WhisperVerboseResult> {
  const response = await groq.audio.transcriptions.create({
    file: fs.createReadStream(audioFilePath),
    model: 'whisper-large-v3-turbo',
    response_format: 'verbose_json',
    timestamp_granularities: ['segment', 'word'],
  });

  return response as unknown as WhisperVerboseResult;
}

// ─── CHAT COMPLETIONS (replaces OpenAI GPT-4o-mini) ─────────────────────────

/**
 * Sends a prompt to Groq's hosted Llama 3.3 70B model.
 * Used in Milestone 6 for chapter generation and summarization.
 *
 * Llama 3.3 70B on Groq is genuinely GPT-4o-class quality for
 * structured reasoning tasks like JSON generation — and at 394 tokens/sec
 * on Groq's LPUs, it's faster than OpenAI's hosted models too.
 */
export async function chatCompletion(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    // JSON mode: forces the model to always return valid JSON.
    // Milestone 6 relies on this — without it, the model might
    // wrap its JSON in markdown fences or add explanation text.
    response_format: { type: 'json_object' },
    temperature: 0.2, // low temperature = more deterministic structured output
  });

  return response.choices[0].message.content ?? '';
}