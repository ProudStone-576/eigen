@AGENTS.md

# Eigen — math for ML, learned by playing

Next.js 16 (App Router) + Prisma 6.19 + Neon Postgres. Invite-only student accounts, one teacher.

## How it fits together

- `lib/content/` — the course. Concepts are TS objects in a dependency graph (`deps`). Each concept is taught by fixed steps: motivate → explore (widget) → truth → connect → check → predict (misconception dislodge) → ml → produce. Answers live here and **never reach the browser**: `publicSteps`/`publicItem` strip them.
- `lib/check/` — answer checking. Expressions are compared by evaluating at many random bindings (method studied from Khan Academy Perseus, MIT; spec in `../reverse engineer/docs/spec/perseus-answer-checking.md`). Numbers, vectors, matrices cellwise. `traps` / wrong `forms` catch specific misconceptions.
- `lib/learning/rules.ts` — the learning system's rules (ported from `Desktop/learning/.claude/skills/teach`) as pure functions. UNKNOWN → EDGE → LANDED → SOLID; MISCONCEPTION must be dislodged. Only unaided production makes SOLID. Spaced review 1,2,4…90 days; a miss resets to 1 day and drops to EDGE.
- `lib/learning/progress.ts` — the only write path for progress: grade → append Attempt → apply rule → XP/streak, in one transaction.
- `components/widgets/Widgets.tsx` — interactive SVG plane: vector, vector-add, scale, combo, transform (draggable î/ĵ), compose.

## Rules for content

- Every MC has exactly one correct option; every distractor is a real error and tagged with a `misconception` when diagnostic.
- Every misconception a check/predict can mark must be dislodgeable in the same lesson (a predict step for it, or another non-review item that targets it). `tests/content.test.ts` enforces this and that every stated answer grades correct.
- Math in `$...$` / `$$...$$`. Double the backslashes in TS strings.

## Run

- `npm run dev`, `npm test`, `npm run typecheck`, `npm run build`
- DB: Neon project `eigen` (`broad-band-27361521`). The app connects through `@prisma/adapter-neon` over WebSockets (443) because raw 5432 is blocked from this machine. `prisma db push` fails here for the same reason: apply schema changes with `npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script` (or `--from-url`) and run the SQL in Neon.
- `.env`: `DATABASE_URL`, `DIRECT_URL`, `INVITE_CODE`, `TEACHER_EMAIL`. The teacher email gets the TEACHER role at signup and sees `/teacher`.
