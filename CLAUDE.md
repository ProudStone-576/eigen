@AGENTS.md

# Eigen — math for ML, learned by playing

Next.js 16 (App Router) + Prisma 6.19 + Neon Postgres. Invite-only student accounts, one teacher.

## How it fits together

- `lib/content/` — the course. Concepts are TS objects in a dependency graph (`deps`). Each concept is taught by fixed steps: motivate → explore (widget) → truth → connect → check → predict (misconception dislodge) → ml → produce. Answers live here and **never reach the browser**: `publicSteps`/`publicItem` strip them.
- `lib/check/` — answer checking. Expressions are compared by evaluating at many random bindings (method studied from Khan Academy Perseus, MIT; spec in `../reverse engineer/docs/spec/perseus-answer-checking.md`). Numbers, vectors, matrices cellwise. `traps` / wrong `forms` catch specific misconceptions.
- `lib/learning/rules.ts` — the learning system's rules (ported from `Desktop/learning/.claude/skills/teach`) as pure functions. UNKNOWN → EDGE → LANDED → SOLID; MISCONCEPTION must be dislodged. Only unaided production makes SOLID. Spaced review 1,2,4…90 days; a miss resets to 1 day and drops to EDGE.
- `lib/learning/progress.ts` — the only write path for progress: grade → append Attempt → apply rule → XP/streak, in one transaction.
- `components/widgets/Widgets.tsx` — interactive SVG plane: vector, vector-add, scale, combo, transform (draggable î/ĵ, optional area/determinant), compose, solve (drag x until Ax hits b).
- `lib/tutor.ts` — AI hint tutor (Claude Opus 5.5, effort low, server-side refusal fallback). Only on produce questions after a wrong answer, never reveals the answer, student input fenced as data, 40 hints/day per student (`Hint` table). Off unless `ANTHROPIC_API_KEY` is set.
- Content: `lib/content/linear-algebra/unit1.ts` (vectors → composition), `unit2.ts` (span → solving Ax = b), `unit3.ts` (eigenvectors → PCA). Vector items with `upToScale` accept any non-zero multiple (eigenvectors, directions). Widgets `eigen` (hunt for Av ∥ v) and `spread` (PCA projections).
- Statistics track: `lib/content/statistics/unit4.ts` (probability → Bayes, independence), `unit5.ts` (variance → covariance matrix, normal, MLE, least squares, losses as likelihoods). Stats widgets live in `components/widgets/StatsWidgets.tsx`: `sim`, `bayes`, `points1d`, `normal`, `likelihood`, `fitline`. Units carry a `track` label; `/learn` groups by it.
- Calculus track: `lib/content/calculus/unit6.ts` (derivative → backprop). Widgets in `components/widgets/CalcWidgets.tsx`: `tangent` (secant → tangent for x², (3x+1)², x³−3x), `gradient2d` (bowl x²+2y²), `descent` (L=(w−3)²+1; η>1 diverges).
- Neural networks track: `lib/content/networks/unit7.ts` (neuron → train a network). Widgets in `components/widgets/NNWidgets.tsx`: `neuron`, `playground` (real 2→H→1 net trained live with backprop; `tests/network.test.ts` checks it learns circle/XOR with tanh and can't without an activation).
- Practice: `lib/content/generators.ts` has question generators for every concept (a test enforces coverage); `lib/learning/practice.ts` mixes target variants with prerequisites, steers towards held misconceptions, and `PRACTICE_STREAK` (3) in a row makes a concept solid. Generated ids are `gen~node~gen~seed`.
- Teacher question editor: `/teacher/content` (teacher only). `CustomItem` rows hold editor input; `lib/content/customSchema.ts` validates and self-grades before save; `lib/content/custom.ts` serves them in practice (`cust~id~p`) and review (`cust~id~r`) via `resolveItem`. Archive instead of delete.
- Live: https://eigen-green.vercel.app (Vercel project `eigen`). `/api/health` checks the DB. Set Vercel env vars with `printf '%s' "$VAL" | vercel env add` — piping from PowerShell adds a newline and breaks them.

## Rules for content

- Every MC has exactly one correct option; every distractor is a real error and tagged with a `misconception` when diagnostic.
- Every misconception a check/predict can mark must be dislodgeable in the same lesson (a predict step for it, or another non-review item that targets it). `tests/content.test.ts` enforces this and that every stated answer grades correct.
- Math in `$...$` / `$$...$$`. Double the backslashes in TS strings.

## Run

- `npm run dev`, `npm test`, `npm run typecheck`, `npm run build`
- DB: Neon project `eigen` (`broad-band-27361521`). The app connects through `@prisma/adapter-neon` over WebSockets (443) because raw 5432 is blocked from this machine. `prisma db push` fails here for the same reason: apply schema changes with `npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script` (or `--from-url`) and run the SQL in Neon.
- `.env`: `DATABASE_URL`, `DIRECT_URL`, `INVITE_CODE`, `TEACHER_EMAIL`. The teacher email gets the TEACHER role at signup and sees `/teacher`.
