# Suno Meta Architect

Experimental Suno AI metatag generator for lyrics.

Paste lyrics in any language and generate:

- Suno Music Prompt
- Full tagged Suno lyrics
- Alternate hooks
- Style DNA
- Internal quality score
- Copy/paste-ready output

## Features

- Auto language detection
- Experimental non-formulaic music architecture
- Suno-style lyric metatags
- Vocal arrangement logic
- Instrumentation design
- Hook generation
- Quality scoring
- Copy buttons
- Regenerate controls

## Setup

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Add your API key inside `.env`:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-5.5
PORT=3000
```

Run locally:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Important

Do not commit your `.env` file to GitHub.

The `.gitignore` file already protects it.
