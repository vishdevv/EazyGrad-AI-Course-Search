# EazyGrad — AI-Powered Degree Program Search

A homepage prototype for EazyGrad, an EdTech platform that helps students find the right online degree program. The core feature is a natural language search: a student describes their background and goals in plain English, and the AI returns the best-matching programs with a one-line explanation of why each is a good fit.

---

## Running locally

**Prerequisites:** Node.js 20+, a MongoDB instance (local or Atlas), an Anthropic API key.

```bash
# 1. Clone and install
git clone <repo-url>
cd eazygrd-ai-course-search
npm install

# 2. Set environment variables
cp .env.example .env.local
# Fill in MONGODB_URI and ANTHROPIC_API_KEY in .env.local

# 3. Seed the program catalog (run once, or whenever you reset the DB)
npm run seed

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string. Atlas example: `mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/eazygrd` |
| `ANTHROPIC_API_KEY` | Anthropic API key from [console.anthropic.com](https://console.anthropic.com) |

Never commit `.env.local`. Only `.env.example` (with empty values) is tracked in git.

---

## Architecture

```
app/
  page.tsx              — Client component. Owns all page state (idle / loading / results / error).
  api/search/route.ts   — POST endpoint. Validates query → fetches programs → calls AI matcher → returns JSON.
  layout.tsx            — Root layout with font setup and metadata.

components/
  HeroSearch.tsx        — Full-width textarea search input with auto-resize and loading state.
  ProgramCard.tsx       — Result card: program details + AI reasoning callout.
  FilterSidebar.tsx     — Client-side filters (degree type, fee, duration, provider).
  SearchStates.tsx      — Loading, error, empty-search, and empty-filter states.

lib/
  db.ts                 — Mongoose connection singleton (cached on global to survive Next.js hot-reload).
  matcher.ts            — Prompt construction, Claude API call, JSON parsing, hallucination guard.

models/
  Program.ts            — Mongoose schema with DegreeType enum enforcement and toJSON serialisation.

types/
  index.ts              — All shared TypeScript interfaces and filter constants.

scripts/
  seed.ts               — Drops and re-inserts 19 representative programs. Run with npm run seed.
```

### Why direct LLM context instead of vector search

With only 15–20 programs, passing the full catalog directly in the system prompt is the correct architectural choice:

- **No infrastructure overhead.** Vector search requires an embedding model, a vector database (Pinecone, Weaviate, etc.), an embedding pipeline, and ongoing sync when data changes. For 19 records, this is pure complexity without benefit.
- **The LLM already does semantic matching.** Sending the full catalog (≈2,000 tokens) to Claude and asking it to reason over all entries is cheaper, faster, and more accurate than retrieving approximate nearest-neighbours and then re-ranking.
- **Full context = better reasoning.** The model can weigh all 19 programs simultaneously and say "these 4 are a strong fit, these 2 are marginal." Vector retrieval would silently drop programs that are good fits but don't share embedding-space proximity with the query phrasing.

The threshold where vector search becomes worthwhile is roughly 500–1,000+ programs, where the catalog no longer fits comfortably in a single prompt.

---

## What I'd build next

1. **Program detail pages** (`/programs/[id]`) — full descriptions, curriculum breakdown, application CTA.
2. **Comparison mode** — let students pin 2–3 programs and view them side by side.
3. **Conversational refinement** — allow follow-up messages ("show me only online ones under ₹1.5L") as a multi-turn conversation layered on top of the initial search.
4. **Admin catalog management** — CRUD UI for adding/editing programs without touching the seed script.
5. **Vector search migration** — once the catalog grows past ~500 programs, switch to MongoDB Atlas Vector Search with pre-computed embeddings and use the LLM only for re-ranking and reasoning generation on the top-K retrieved results.
6. **Analytics** — track which queries users are submitting and which programs they click through to, feeding back into catalog curation.
