# FastForward: Smart Video Summary & Deep-Search Platform

A MERN stack AI application that transcribes videos, generates semantic
chapter markers, and lets users search video content by meaning — not
just keywords — jumping directly to the relevant timestamp.

## Tech Stack
- **Runtime**: Node.js + TypeScript
- **API**: Express + BullMQ async job queues (Redis)
- **AI Transcription**: Groq Whisper Large v3 Turbo
- **AI Summarization**: Groq Llama 3.3 70B
- **Semantic Search**: local all-MiniLM-L6-v2 embeddings + MongoDB Atlas Vector Search
- **Frontend**: React + Vite + TailwindCSS

## Setup
1. Clone the repo
2. Copy `backend/.env.example` to `backend/.env` and fill in your keys
3. Get a free Groq API key at [console.groq.com](https://console.groq.com)
4. Get a free MongoDB Atlas cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
5. `npm install` from root
6. `npm run dev:api` and `npm run dev:worker` in separate terminals