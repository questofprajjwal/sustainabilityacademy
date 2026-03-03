# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a single-file interactive learning course for Verra's **VM0042 v2.2** "Improved Agricultural Land Management" carbon methodology. The entire application lives in two identical files — `index.html` (Vercel entry point) and `VM0042_Learning_Module.html` (working copy). **Always edit `VM0042_Learning_Module.html` and sync to `index.html` after.**

**Live URL:** https://vm0042-learning-module.vercel.app
**Repo:** https://github.com/questofprajjwal/VM0042-Learning-Module

## Development Workflow

There is no build step, package manager, or test runner. The file runs directly in any browser.

```bash
# Preview locally
open index.html

# Sync working copy to entry point (always do this before deploying)
cp VM0042_Learning_Module.html index.html

# Validate before committing (checks backtick parity and lesson count)
node --input-type=module <<'EOF'
import { readFileSync } from 'fs';
const html = readFileSync('index.html', 'utf8');
const start = html.indexOf('<script type="text/babel">');
const end = html.indexOf('</script>', start);
const js = html.slice(start + '<script type="text/babel">'.length, end);
const bt = (js.match(/`/g)||[]).length;
console.log('Backticks:', bt, bt%2===0 ? 'EVEN ✓' : 'ODD ✗ (broken template literal)');
console.log('Lessons:', (js.match(/LESSONS\["/g)||[]).length);
EOF

# Deploy to Vercel
vercel --prod --yes
```

## Architecture

The entire app is a single `<script type="text/babel">` block inside `index.html`. React 18, ReactDOM, Babel standalone, and Tailwind CSS are all loaded from CDN — no npm, no bundler.

### Data Layer (top of script)

**`MODULES` array** — defines sidebar structure and module metadata:
```js
{ id: 7, color: "purple", icon: "✅", title: "...", subtitle: "...", lessons: [{ id: "7.1", title: "..." }] }
```
Module IDs run 0–10; lesson IDs are strings like `"7.1"`, `"7.2"`, `"CAP"`. The sidebar and home cards display `mod.id + 1` as the label (so id 0 shows as "Module 1").

**`LESSONS` object** — keyed by lesson ID string, each entry has:
```js
LESSONS["7.1"] = {
  title: "...",
  vmRef: "Source document reference",
  duration: "70 min",
  content: `...raw HTML string (template literal)...`,
  quiz: [{ q: "Question?", options: ["A","B","C","D"], answer: 2, explanation: "..." }]
}
```
Lesson content is raw HTML injected via `dangerouslySetInnerHTML`. All styling uses Tailwind utility classes inline.

**`colorMap`** — maps color names to Tailwind class sets (`bg`, `text`, `border`, `btn`, `active`). Every module has a `color` property that must exist in `colorMap`. Current colors: `green`, `emerald`, `teal`, `blue`, `violet`, `orange`, `red`, `purple`, `cyan`, `rose`, `indigo`.

### React Components

- **`App`** — root component; owns `completed` state (persisted to `localStorage` under key `vm0042_progress`), `currentLesson` (string ID or null), `collapsed` (sidebar). Computes `allLessons`, `prevLesson`, `nextLesson` from `MODULES` and passes them to `LessonView`. Auto-advances to next lesson on completion.
- **`Sidebar`** — collapsible left nav; owns `expanded` state (which modules are open). A `useEffect` on `currentLesson` automatically expands the module containing the active lesson. On mobile (`< md` breakpoint) the sidebar overlays content; a tap-outside backdrop closes it.
- **`HomeView`** — shown when `currentLesson === null`; renders module cards with progress bars and a "Resume Course" CTA when a course is in progress. Contains the page footer.
- **`LessonView`** — renders `lesson.content` HTML + `Quiz` component + complete button. Accepts `onPrev`/`onNext` callbacks for previous/next lesson navigation and shows in-module position ("Lesson X of Y in Module Name").
- **`Quiz`** — accepts `questions` and `lessonId` props. Persists `answers` and `submitted` state to `localStorage` under key `vm0042_quiz_<lessonId>`, so quiz state survives navigation. Shows color-coded per-question feedback and a score summary banner once all questions are submitted.

### localStorage Keys

| Key | Content |
|-----|---------|
| `vm0042_progress` | `{ [lessonId]: true }` — completed lessons |
| `vm0042_quiz_<lessonId>` | `{ answers: {}, submitted: {} }` — per-lesson quiz state |

### Content Box CSS Classes

These classes are defined in the `<style>` block and used throughout lesson content:

| Class | Appearance | Use for |
|-------|-----------|---------|
| `highlight-box` | Green left border | Key takeaways, why-it-matters callouts |
| `analogy-box` | Blue left border | Real-world analogies |
| `example-box` | Amber left border | Worked numerical examples |
| `formula-box` | Dark slate background | Mathematical formulas (light text on dark) |

## Adding a New Module

1. Add entry to `MODULES` array with a new `id`, `color` (must exist in `colorMap`), `icon`, `title`, `subtitle`, and `lessons` array.
2. Add `LESSONS["X.Y"] = { ... }` entries for each lesson before `LESSONS["CAP"]`.
3. If using a new color name, add it to `colorMap` with all five keys: `bg`, `text`, `border`, `btn`, `active`.
4. Run the validation script above to confirm even backtick count and correct lesson count.
5. `cp VM0042_Learning_Module.html index.html` then deploy.

## Content Verification Workflow

After adding or editing lessons sourced from PDFs, run both CLI verifiers against the original PDFs:

```bash
# Gemini — factual accuracy vs PDF
gemini -p "Review LESSONS[\"X.Y\"] in VM0042_Learning_Module.html against [PDF path]. Check all formulas, thresholds, tables, and identify anything missing. Rate depth 1–10."

# Codex — deeper line-by-line accuracy + clarity
codex exec -c 'sandbox_permissions=["disk-full-read-access"]' "Review LESSONS[\"X.Y\"] in VM0042_Learning_Module.html against [PDF path]. Check all formulas, values, thresholds. Suggest exact wording improvements."
```

Both CLIs can read PDFs directly from `/Users/knowprajjwal/Verra/VCS/`.

## Source PDFs

All source documents are in `/VCS/`:

| File | Used in |
|------|---------|
| `VM0042v2.2.pdf` | Modules 1–5 |
| `Registration-and-Issuance-Process-v5.0.pdf` | Module 6.1 |
| `VCS-Program-Guide-v5.0.pdf` | Module 6.2 |
| `Clarification-Verra-Program-Fee-Schedule-April-2025.pdf` | Module 6.1 fees |
| `VT0008-Additionality-Assessment-v1.0.pdf` | Module 7 |
| `VMD0053v2.1_BIOGEOCHEMICAL_MODEL_CALIBRATION_...pdf` | Module 8 |
| `AFOLU-Non-Permanence-Risk-Tool-v4.2-last-updated-May-3-2024.pdf` | Module 9 |

## Known Gotchas

- **Backtick parity is critical.** Lesson `content` fields are template literals. An unclosed backtick breaks the entire app silently in Babel. Always run the validation script after edits.
- **`index.html` and `VM0042_Learning_Module.html` must be kept identical.** Vercel serves `index.html`; all editing happens in `VM0042_Learning_Module.html`.
- **Quiz `answer` is a 0-based index** into the `options` array, not the option letter.
- **Lesson IDs are strings**, not numbers — `"7.1"` not `7.1`. The `MODULES` `lessons` array and `LESSONS` object must use identical string keys.
- **`colorMap` fallback is `colorMap.green`** — a missing color won't crash but will silently render green. Always add a new color to `colorMap` before using it in `MODULES`.
- **Module display label is `mod.id + 1`**, not `mod.id` — module with `id: 0` shows as "Module 1" in the UI.
- **The footer lives inside `HomeView`**, not in the HTML body. Do not add a `<footer>` tag outside the React root.
