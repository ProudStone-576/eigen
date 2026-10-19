/**
 * Course content lives in code, versioned with the app. Each concept is a node
 * in a dependency graph; each node is taught by a fixed sequence of steps that
 * follows the learning system: motivate -> explore -> establish -> connect ->
 * check -> (dislodge a misconception) -> produce.
 *
 * Text fields accept inline math as $...$ and display math as $$...$$.
 */

export type Vec = number[];
export type Mat = number[][]; // rows

// ---------- Questions ----------

export type McOption = {
  id: string;
  text: string;
  correct?: boolean;
  /** The misconception someone holding this answer has. Diagnostic, not decoration. */
  misconception?: string;
  /** Why this option is right or wrong. Shown after answering. */
  why: string;
};

export type McItem = { kind: "mc"; id: string; prompt: string; options: McOption[] };

export type NumberItem = {
  kind: "number";
  id: string;
  prompt: string;
  answer: number;
  /** Absolute tolerance for approximate answers. Default exact (1e-9). */
  tolerance?: number;
  explain: string;
};

export type VectorItem = {
  kind: "vector";
  id: string;
  prompt: string;
  answer: Vec;
  explain: string;
  /** Accept any non-zero multiple of the answer (eigenvectors, directions). */
  upToScale?: boolean;
  /** Specific wrong answers worth catching, with the misconception behind them. */
  traps?: { answer: Vec; misconception: string; message: string }[];
};

export type MatrixItem = {
  kind: "matrix";
  id: string;
  prompt: string;
  answer: Mat;
  explain: string;
  traps?: { answer: Mat; misconception: string; message: string }[];
};

export type ExpressionForm = {
  value: string;
  status: "correct" | "wrong";
  misconception?: string;
  message?: string;
};

export type ExpressionItem = {
  kind: "expression";
  id: string;
  prompt: string;
  /** Matched top to bottom. Put specific wrong forms before the correct one. */
  forms: ExpressionForm[];
  explain: string;
};

export type Item = McItem | NumberItem | VectorItem | MatrixItem | ExpressionItem;

// ---------- Interactive widgets ----------

export type Widget =
  | { kind: "vector"; start: Vec }
  | { kind: "vector-add"; a: Vec; b: Vec }
  | { kind: "scale"; v: Vec; k: number }
  | { kind: "combo"; v: Vec; w: Vec; a: number; b: number }
  | { kind: "transform"; matrix: Mat; showVector?: Vec; lockMatrix?: boolean; showArea?: boolean }
  | { kind: "compose"; first: Mat; second: Mat; firstName?: string; secondName?: string }
  /** Drag the input until A·x hits the target: solving A x = b by hand. */
  | { kind: "solve"; matrix: Mat; target: Vec; start: Vec }
  /** Drag v and watch Av: find the directions A doesn't knock off their own line. */
  | { kind: "eigen"; matrix: Mat; start: Vec }
  /** Rotate a direction through a data cloud and maximise the spread of the projections (PCA). */
  | { kind: "spread"; points: Vec[] };

// ---------- Lesson steps ----------

export type Step =
  | { type: "motivate"; title: string; body: string; realWorld: { title: string; body: string } }
  | { type: "explore"; title: string; body: string; widget: Widget; task: string }
  | { type: "truth"; statement: string; body: string }
  | { type: "connect"; body: string }
  | { type: "check"; item: McItem }
  | {
      type: "predict";
      /** Misconception this sequence dislodges. */
      misconception: string;
      /** 1. Commit to a prediction. */
      item: McItem;
      /** 2. See reality. No explanation yet. */
      reveal: { body: string; widget: Widget };
      /** 3. Student resolves what had to give. */
      resolve: McItem;
    }
  | { type: "ml"; title: string; body: string }
  | { type: "produce"; body: string; items: Item[] };

export type GlossaryTerm = { term: string; meaning: string };

export type ConceptNode = {
  id: string;
  title: string;
  /** One line: the unconditional truth this node locks in. */
  summary: string;
  deps: string[];
  /** Terms introduced here, defined before use. Keep it to a few. */
  glossary: GlossaryTerm[];
  /** Position on the concept map (grid units). */
  pos: { x: number; y: number };
  steps: Step[];
  /** Pool for spaced review and "test out". Unseen in the lesson where possible. */
  review: Item[];
  misconceptions: Record<string, string>;
};

export type Unit = { id: string; title: string; blurb: string; nodes: ConceptNode[] };
export type Course = { id: string; title: string; units: Unit[] };
