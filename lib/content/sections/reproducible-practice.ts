import { deepen, ex, mc, num } from "../deepen";
import { mcNumbers, r2 } from "../generators";
import type { Template } from "../templates";
import type { ConceptNode, Item } from "../types";

/** Reproducible analysis and version control; statistical programming in Python and R; SQL for statistical data extraction; validating statistical software. */

/** Accepts an exact fraction or 3 decimal places. */
const fr = (id: string, prompt: string, value: number, explain: string) => num(id, `${prompt} Give an exact fraction or 3 decimal places.`, value, explain, 0.0005);

const base: ConceptNode = {
  id: "reproducible-practice",
  title: "Reproducible analysis & statistical programming",
  summary: "An analysis is only as trustworthy as the code that produced it. Reproducible practice means anyone can rerun the same code on the same data and get the same numbers: scripted steps, recorded seeds and package versions, version control. Day to day the work happens in Python, R and SQL, each with defaults that can silently change an answer, so results should be checked against known values.",
  deps: ["statistical-computing", "data-quality", "spread-measures"],
  pos: { x: 2, y: 0 },
  glossary: [
    { term: "reproducible", meaning: "Rerunning the same code on the same data gives the same results." },
    { term: "version control", meaning: "Recording every change to code (with git, for example), so any earlier version can be recovered and compared." },
    { term: "NULL / NA", meaning: "A missing value in SQL (NULL) or R (NA); in pandas usually NaN." },
  ],
  misconceptions: {
    "notebook-reproducible": "Thinks a notebook that once produced a result is reproducible, even if its cells were run out of order or depend on hidden state.",
    "sql-null-zero": "Thinks SQL's `AVG` and `SUM` treat missing (NULL) values as 0.",
  },
  steps: [
    {
      type: "motivate",
      title: "Could you do it again?",
      body: "Six months after a report, a reviewer asks you to rerun the analysis with one more month of data. Which file did you use? Which rows did you delete by hand? Which version of the package? If the answers are lost, so is the result. Reproducible habits make every number traceable to code, data and settings.",
      realWorld: {
        title: "A spreadsheet error in economics",
        body: "An influential 2010 economics paper on public debt and growth was found in 2013 to contain a spreadsheet error that left five countries out of an average; reworked with all the data, the headline result weakened considerably. Scripted, version-controlled analyses make such errors easier to find.",
      },
    },
    {
      type: "truth",
      statement: "A reproducible analysis keeps **raw data read-only**, does every step in **code** (no manual edits), sets and records **random seeds** (§{monte-carlo}), pins **package versions** (a `requirements.txt` or `renv.lock`), and lives under **version control** such as git, with the exact commit used for each report tagged. Notebooks should **run top to bottom** from a fresh start before results are trusted.",
      body: "Know the defaults. In Python, `np.var(x)` divides by $n$ while pandas' `Series.var()` divides by $n - 1$ (§{spread-measures}); statsmodels' `ols(\"y ~ x\", data=df).fit()` and R's `lm(y ~ x, data = df)` fit the same regression. In R, `mean(c(1, NA, 3))` is `NA` unless `na.rm = TRUE`. In SQL, `AVG(col)` and `SUM(col)` **skip** NULLs, `COUNT(*)` counts rows but `COUNT(col)` counts non-NULL values, `WHERE` filters rows before `GROUP BY` and `HAVING` filters groups after; a join to a table with several matching rows **duplicates** rows and inflates sums. **Validate** software: reproduce published or certified results (such as NIST's reference datasets), simulate data with known parameters and check they are recovered, and write tests for edge cases (missing values, empty groups, ties).",
    },
    {
      type: "predict",
      misconception: "sql-null-zero",
      item: {
        kind: "mc",
        id: "rpr-predict-1",
        prompt: "A column `score` holds 10, NULL and 20. What does `SELECT AVG(score)` return?",
        options: [
          { id: "a", text: "15: NULLs are skipped, so it averages 10 and 20", correct: true, why: "Aggregates ignore NULLs." },
          { id: "b", text: "10: the NULL counts as 0", misconception: "sql-null-zero", why: "SQL aggregates don't treat NULL as 0." },
          { id: "c", text: "NULL", why: "That happens for arithmetic like `10 + NULL`, not for `AVG`." },
        ],
      },
      reveal: {
        body: "SQL aggregate functions drop NULLs: `AVG(score)` is $(10 + 20)/2 = 15$, and `COUNT(score)` is 2 while `COUNT(*)` is 3. If a missing score should count as 0, say so with `AVG(COALESCE(score, 0))`, which gives 10. Which is right depends on what the NULL means: that decision belongs in the analysis plan (§{data-quality}).",
      },
      resolve: {
        kind: "mc",
        id: "rpr-resolve-1",
        prompt: "`AVG(amount)` over the values 5, NULL, 7 returns",
        options: [
          { id: "a", text: "6", correct: true, why: "The NULL is skipped: $(5 + 7)/2$." },
          { id: "b", text: "4", misconception: "sql-null-zero", why: "That counts the NULL as 0." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "rpr-check-1",
        prompt: "A notebook's final cell shows a striking result. Its cells were run in the order 1, 4, 2, 4, 6, 3, 6, and cell 3 was later deleted. Is the result reproducible?",
        options: [
          { id: "a", text: "Not yet: restart, run all cells top to bottom, and check the result survives", correct: true, why: "Hidden state from deleted or out-of-order cells may have produced it." },
          { id: "b", text: "Yes, the notebook produced it", misconception: "notebook-reproducible", why: "The saved notebook may not regenerate the result." },
          { id: "c", text: "Yes, if the file is in version control", why: "Version control records the file, not the hidden kernel state." },
        ],
      },
    },
    {
      type: "check",
      item: {
        kind: "mc",
        id: "rpr-check-2",
        prompt: "For the data 2, 4, 6, `np.var` and pandas' `.var()` return",
        options: [
          { id: "a", text: "2.667 and 4", correct: true, why: "Divisors $n = 3$ and $n - 1 = 2$ for the sum of squares 8." },
          { id: "b", text: "4 and 4", why: "NumPy's default divides by $n$." },
          { id: "c", text: "2 and 2", why: "That is the standard deviation." },
        ],
      },
    },
    {
      type: "ml",
      title: "In machine learning",
      body: "Experiment tracking (logging code commit, data version, hyperparameters, seeds and metrics for every run) is reproducibility for model training. Feature pipelines are often SQL, and the same NULL and join pitfalls cause training–serving skew when production code handles missing values differently from the training query.",
    },
    {
      type: "produce",
      body: "Unaided. All right turns this **solid**.",
      items: [
        { kind: "number", id: "rpr-produce-1", prompt: "A column has values 4, NULL, NULL, 8, 6. What does `COUNT(col)` return?", answer: 3, explain: "Non-NULL values only." },
        { kind: "number", id: "rpr-produce-2", prompt: "Customer A has orders of ₹100 and ₹50 and three rows in an addresses table. Joining orders to addresses on customer and summing the amount gives what (in rupees)?", answer: 450, explain: "Each order appears 3 times: $3 \\times 150$." },
        {
          kind: "mc",
          id: "rpr-produce-3",
          prompt: "`AVG(rating)` over 5, NULL, 3 returns",
          options: [
            { id: "a", text: "4", correct: true, why: "NULL is skipped." },
            { id: "b", text: "8/3", misconception: "sql-null-zero", why: "That counts the NULL as 0." },
          ],
        },
        {
          kind: "mc",
          id: "rpr-produce-4",
          prompt: "Before sharing a notebook's results, you should",
          options: [
            { id: "a", text: "restart the kernel and run every cell in order", correct: true, why: "That proves the saved code produces the results." },
            { id: "b", text: "nothing: if it ran once, it is reproducible", misconception: "notebook-reproducible", why: "Out-of-order runs leave hidden state." },
          ],
        },
      ],
    },
  ],
  review: [{ kind: "number", id: "rpr-review-1", prompt: "A table has 5 rows; the column `x` is NULL in 2 of them. What does `COUNT(*)` return?", answer: 5, explain: "It counts rows." }],
};

export const node = deepen(base, {
  definitions: [
    {
      type: "definition",
      term: "a reproducible project",
      body: "A folder with `data/raw` (never edited), `data/derived` (made by code), `src` (scripts or functions), `reports` (generated documents), a file pinning package versions, and a README saying how to run everything with one command. Under git, each change is a commit with a message; large or sensitive data stay outside the repository but are identified by version or checksum.",
    },
    {
      type: "definition",
      term: "SQL for statistics",
      body: "`SELECT region, COUNT(*) AS n, AVG(sales) AS mean_sales FROM orders WHERE year = 2025 GROUP BY region HAVING COUNT(*) >= 30` computes group sizes and means, keeping only groups with at least 30 rows. **Window functions** compute per-row statistics without collapsing rows, such as `AVG(sales) OVER (PARTITION BY region)` or running totals with `ORDER BY`. Check row counts before and after every join.",
    },
  ],
  theorems: [
    {
      type: "theorem",
      kind: "Rule",
      name: "check defaults before trusting output",
      statement: "Before comparing numbers across tools, check the divisor of variance functions, how missing values are handled, how categorical variables are coded (reference level), and the parameterisation of distributions (rate or scale).",
      proof: ["Each of these differs between common libraries, and each changes results without any error message."],
    },
    {
      type: "theorem",
      kind: "Proposition",
      name: "join inflation",
      statement: "Joining a table with one row per order to a table with $k$ rows per customer repeats each order $k$ times, multiplying sums by $k$ but leaving averages over the joined rows unchanged only if every customer has the same $k$.",
      proof: ["Each order row matches $k$ rows; sums scale by each customer's $k$, so averages are reweighted towards customers with more matches."],
    },
    {
      type: "theorem",
      kind: "Rule",
      name: "validating statistical code",
      statement: "Test new code on (1) inputs with known answers, (2) data simulated from known parameters, checking they are recovered within Monte Carlo error, and (3) edge cases. Agreement between two independent implementations is further evidence.",
      proof: ["Each check targets a different failure: formula errors, estimation errors and boundary handling."],
    },
  ],
  examples: [
    {
      type: "example",
      level: 1,
      title: "variance defaults",
      problem: "For 2, 4, 6, find `np.var(x)`, `np.var(x, ddof=1)` and R's `var(x)`.",
      solution: ["Sum of squared deviations from 4 is $4 + 0 + 4 = 8$.", "`np.var(x)` $= 8/3 \\approx 2.667$; with `ddof=1` and in R, $8/2 = 4$."],
      result: "2.667, 4 and 4.",
    },
    {
      type: "example",
      level: 2,
      title: "NULLs in SQL",
      problem: "Values 10, NULL, 20. Find `AVG(x)`, `COUNT(*)`, `COUNT(x)` and `AVG(COALESCE(x, 0))`.",
      solution: ["`AVG(x)` $= 15$; `COUNT(*)` $= 3$; `COUNT(x)` $= 2$.", "`AVG(COALESCE(x, 0))` $= 30/3 = 10$."],
      result: "15, 3, 2, 10.",
    },
    {
      type: "example",
      level: 3,
      title: "a join that inflates",
      problem: "Orders: A ₹100, A ₹50, B ₹80. Addresses: A has 3, B has 1. Joining on customer, find the summed amount and the true total.",
      solution: ["A's two orders appear 3 times each: $3 \\times 150 = 450$; B's once: 80. Joined sum 530.", "True total $230$. Aggregate orders per customer first, or join to one address per customer."],
      result: "530 against 230.",
    },
  ],
  pitfalls: [
    { wrong: "Edit raw data by hand.", right: "Keep raw data read-only and make every change in code." },
    { wrong: "Trust a notebook that ran once.", right: "Restart and run all cells in order." },
    { wrong: "Assume NULLs count as 0, or that every tool's variance uses $n - 1$.", right: "Check the defaults." },
  ],
  formulas: [
    { label: "NumPy variance", tex: "\\tfrac1n\\textstyle\\sum(x_i - \\bar x)^2\\ \\text{by default}" },
    { label: "pandas / R variance", tex: "\\tfrac{1}{n - 1}\\textstyle\\sum(x_i - \\bar x)^2" },
    { label: "SQL averages", tex: "\\text{AVG} = \\dfrac{\\sum \\text{non-NULL}}{\\#\\text{non-NULL}}" },
  ],
  exercises: [
    ex(1, num("rprx-ex-1", "Values 3, NULL, 9, NULL. What does `AVG` return?", 6, "Average of 3 and 9."), ["$6$."]),
    ex(1, num("rprx-ex-2", "Values 3, NULL, 9, NULL. What does `COUNT(*)` return?", 4, "All rows."), ["$4$."]),
    ex(2, fr("rprx-ex-3", "For 1, 2, 3, 6, find `np.var(x)` (NumPy's default).", 3.5, "Sum of squares $14$ over $n = 4$."), ["Mean 3; squares $4 + 1 + 0 + 9 = 14$; $14/4 = 3.5$."]),
    ex(2, fr("rprx-ex-4", "For the same data, find pandas' `.var()`.", 14 / 3, "Divide by $n - 1$."), ["$14/3 \\approx 4.667$."]),
    ex(2, num("rprx-ex-5", "Orders of ₹200 and ₹100 for one customer with 2 rows in a contacts table. Find the summed amount after joining.", 600, "Each order twice."), ["$600$ against a true 300."]),
    ex(3, mc("rprx-ex-6", "In R, `mean(c(4, NA, 8))` returns", ["`NA`", "Missing values propagate unless `na.rm = TRUE`."], [["6", "That needs `na.rm = TRUE`."], ["4", "R doesn't treat NA as 0."]]), ["Unlike SQL's `AVG`, R's `mean` doesn't skip missing values by default."]),
    ex(3, mc("rprx-ex-7", "A colleague's reanalysis differs from yours in the third decimal. The first thing to compare is", ["package versions, seeds and default settings", "Silent differences in defaults are common."], [["nothing: small differences are random", "Reproducible code should match exactly."], ["the hardware", "Rarely the cause compared with versions and seeds."]]), ["Pin versions and record seeds."]),
    ex(3, mc("rprx-ex-8", "To validate a new regression routine, the strongest single check is", ["matching certified results on reference datasets", "Known correct answers to many digits."], [["checking it runs without errors", "Running isn't being right."], ["comparing with a colleague's guess", "Not a reliable standard."]]), ["Then add simulation-recovery and edge-case tests."]),
  ],
});

const n = (prompt: string, answer: number, explain: string, tolerance?: number): Item => ({ kind: "number", id: "", prompt, answer, explain, ...(tolerance ? { tolerance } : {}) });

export const templates: Template[] = [
  {
    type: "compute",
    make: (r) => {
      const k = r.int(4, 7);
      const vals: (number | null)[] = Array.from({ length: k }, () => (r.next() < 0.3 ? null : r.int(1, 20)));
      if (!vals.some((v) => v !== null)) vals[0] = 5;
      const present = vals.filter((v): v is number => v !== null);
      const want = r.pick(["AVG(x)", "COUNT(x)", "COUNT(*)", "SUM(x)"] as const);
      const v = want === "AVG(x)" ? present.reduce((s, x) => s + x, 0) / present.length : want === "COUNT(x)" ? present.length : want === "COUNT(*)" ? k : present.reduce((s, x) => s + x, 0);
      return n(`A column \`x\` holds ${vals.map((x) => (x === null ? "NULL" : x)).join(", ")}. What does \`${want}\` return (3 decimals)?`, Math.round(v * 1000) / 1000, want === "COUNT(*)" ? "It counts every row." : `NULLs are skipped: ${present.length} non-NULL value${present.length === 1 ? "" : "s"}.`, 0.001);
    },
  },
  {
    type: "compute",
    make: (r) => {
      const xs = Array.from({ length: r.int(3, 6) }, () => r.int(0, 10));
      if (new Set(xs).size === 1) xs[0] += 2;
      const m = xs.reduce((s, x) => s + x, 0) / xs.length;
      const ss = xs.reduce((s, x) => s + (x - m) ** 2, 0);
      const np = r.pick([true, false]);
      const v = np ? ss / xs.length : ss / (xs.length - 1);
      return n(`For ${xs.join(", ")}, find ${np ? "`np.var(x)` (NumPy's default)" : "pandas' `x.var()`"} (3 decimals).`, Math.round(v * 1000) / 1000, `Sum of squared deviations ${r2(ss)}, divided by ${np ? `$n = ${xs.length}$` : `$n - 1 = ${xs.length - 1}$`}.`, 0.001);
    },
  },
  {
    type: "interpret",
    make: (r) => {
      const sets: (number | null)[][] = [[4, null, 6], [10, null, 30], [2, 8, null], [null, 5, 15]];
      const v = r.pick(sets);
      const present = v.filter((x): x is number => x !== null);
      const avg = present.reduce((s, x) => s + x, 0) / present.length;
      const zeroAvg = present.reduce((s, x) => s + x, 0) / v.length;
      return mcNumbers(
        `\`AVG(x)\` over ${v.map((x) => (x === null ? "NULL" : x)).join(", ")} returns`,
        { text: `${r2(avg)}`, why: "NULLs are skipped." },
        [{ text: `${r2(zeroAvg)}`, why: "That treats NULL as 0.", misconception: "sql-null-zero" }],
      );
    },
  },
];
