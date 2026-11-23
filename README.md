# Eigen

**Math for machine learning, learned by playing.** An interactive course platform for students preparing for competitive exams (JEE Main/Advanced, SAT and similar), covering linear algebra, statistics, calculus and neural networks, with a classroom layer for schools and teachers.

**Live:** https://eigen-green.vercel.app

## What it does

- **Concept graph, not a syllabus.** Every concept is a node with dependencies. A lesson runs a fixed sequence: motivate, explore with an interactive widget, state the truth, connect, check, and predict (which is where misconceptions get confronted).
- **Mastery tracking.** Each concept moves through `UNKNOWN`, `EDGE`, `LANDED` and `SOLID`. A recorded misconception must be dislodged before the concept can advance, and only unaided answers count towards mastery.
- **Interactive widgets.** A draggable SVG plane for vectors, linear transformations and solving `Ax = b`, plus statistics, calculus (tangents, gradients) and a small neural network trained live in the browser.
- **Robust answer checking.** Algebraic answers are compared by evaluating at many random values, so equivalent forms are accepted.
- **Practice generators.** Compute, reverse, interpret, error-spotting and real-world question types at three levels.
- **Hint tutor.** An AI tutor gives hints only after a wrong answer on produce-style questions. It never reveals the answer, treats student input as data, and is rate-limited per student.
- **Classrooms.** Organisations contain classes; teachers create assignments, see class and per-student progress and common misconceptions, and edit their own questions. Students join with a class code or an invitation link.
- **Security basics.** Hashed passwords with lockout after repeated failures, an audit log of security-relevant actions, and database-backed rate limits.

## Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Database | Postgres on Neon, accessed with Prisma |
| Maths and graphics | KaTeX, mathjs, three.js |
| AI | Anthropic SDK (hint tutor only) |
| Validation | zod |
| Tests | Vitest |
| Hosting | Vercel |

## Getting started

Prerequisites: Node.js 20 or newer and a Postgres database (a free Neon project works).

```bash
git clone https://github.com/ProudStone-576/eigen.git
cd eigen
npm install
cp .env.example .env     # then fill in the values below
npm run dev
```

Open http://localhost:3000.

### Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Pooled Postgres connection string used by the app |
| `DIRECT_URL` | Direct connection string used for schema changes |
| `INVITE_CODE` | Code students need to sign up |
| `TEACHER_EMAIL` | The account with this email becomes the teacher |

The AI hint tutor also needs an Anthropic API key in the environment.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm test` | Run the Vitest suite |
| `npm run typecheck` | Type-check without emitting |
| `npm run build` | Generate the Prisma client and build for production |
| `npm run db:push` | Push the Prisma schema to the database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run make-admin` | Promote a user to admin |

Schema changes are also kept as SQL files in `prisma/sql/`.

## Project structure

```
app/                 Routes: learn, practice, review, courses, exam, teacher, admin, account, join
components/          Widgets, lesson sections and 3D intro scenes
lib/
  content/           The course: concepts, questions, generators and templates
  check/             Answer checking
  learning/          Mastery rules and the progress write path
  org/ auth/ security/   Organisations, sessions and rate limits
  tutor.ts           Hint tutor
prisma/              Schema and SQL migrations
tests/               Content, maths, checker, network and platform tests
```

## Content rules

Content is validated by tests. Every multiple-choice question has exactly one correct option, every distractor is a real error, and every misconception a question can flag must be teachable within the same lesson. Maths is written in `$...$` and `$$...$$`.

## CI

GitHub Actions runs Prisma validation, type-checking, the tests and a production build on every push.
