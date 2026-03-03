# Verra Academy — Multi-Course Sustainability Learning Platform

## Context

The current VM0042 Learning Module is a single-file React app (4860 lines) teaching one Verra methodology. The goal is to transform it into a scalable multi-course sustainability learning platform where VM0042 becomes one course among many. This enables adding courses on other methodologies, carbon markets, ESG frameworks, and more — all with shared navigation, progress tracking, and consistent UX.

**Review status:** Plan reviewed by Gemini and Codex. Tech stack confirmed (8–8.5/10). Execution timeline extended from 4 days to 8–10 days per reviewer feedback. UI/UX enhancements added for accessibility, mobile, and multi-course scaling.

---

## Architecture: Next.js 14 + MDX + TypeScript

### Why Next.js (confirmed after comparative review)

| Alternative | Verdict | Why Not |
|---|---|---|
| **Astro** | Strong for pure content, but weaker for interactivity | Quiz components, progress hooks, and future auth/API needs favor React-first framework |
| **Vite + React** | Simpler dev UX | Loses integrated file routing, SSG conventions; requires more assembly |
| **Remix** | Excellent for server data flows | Overkill for static content + client-side progress; larger migration friction |
| **Next.js 14** | **Selected** | SSG + App Router + file routing + Vercel-native + largest React ecosystem |

### Core benefits over current single-file approach

- **Content separation**: Each lesson becomes its own `.mdx` file (no more backtick parity bugs)
- **Type safety**: TypeScript catches errors at build time
- **File-based routing**: `/courses/vm0042/1.1` just works
- **Static generation**: All pages pre-rendered at build — fast, no server needed
- **Vercel-native**: Zero-config deployment (already using Vercel)

---

## Directory Structure

```
verra-academy/
├── scripts/
│   ├── migrate-content.ts        ← Automated HTML→MDX migration script
│   └── validate-content.ts       ← Build-time content integrity checks
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                    ← Root layout (platform shell)
│   │   ├── page.tsx                      ← Landing page (course catalog)
│   │   └── courses/
│   │       ├── page.tsx                  ← All courses grid
│   │       └── [courseId]/
│   │           ├── layout.tsx            ← Course layout (sidebar + topbar)
│   │           ├── page.tsx              ← Course overview (module cards)
│   │           └── [lessonId]/
│   │               └── page.tsx          ← Lesson viewer
│   │
│   ├── components/
│   │   ├── platform/
│   │   │   ├── PlatformNav.tsx           ← Top nav (logo, course switcher, "Continue Learning")
│   │   │   ├── Breadcrumb.tsx            ← Platform > Course > Module > Lesson
│   │   │   ├── CourseCard.tsx            ← Card for course catalog
│   │   │   └── Footer.tsx
│   │   ├── learning/
│   │   │   ├── Sidebar.tsx              ← Course sidebar (modules + lessons)
│   │   │   ├── LessonView.tsx           ← Lesson content renderer
│   │   │   ├── Quiz.tsx                 ← Quiz component (keyboard-accessible)
│   │   │   ├── ProgressBar.tsx
│   │   │   └── LessonNav.tsx            ← Prev/Next navigation
│   │   └── content/
│   │       ├── HighlightBox.tsx          ← Green callout
│   │       ├── AnalogyBox.tsx            ← Blue callout
│   │       ├── ExampleBox.tsx            ← Amber callout
│   │       ├── FormulaBox.tsx            ← Dark slate formula
│   │       ├── ResponsiveTable.tsx       ← Wraps tables in overflow-x-auto
│   │       └── mdx-components.tsx        ← MDX component map (strict allowlist)
│   │
│   ├── lib/
│   │   ├── courses.ts                    ← Course registry + metadata loader
│   │   ├── progress.ts                   ← useProgress / usePlatformProgress hooks
│   │   ├── progress-export.ts            ← Export/import progress as JSON file
│   │   ├── schemas.ts                    ← Zod schemas for course.yaml + quiz.yaml
│   │   ├── types.ts                      ← Shared TypeScript types
│   │   └── colors.ts                     ← Color map (from current colorMap)
│   │
│   └── content/                          ← ALL course content
│       ├── vm0042/
│       │   ├── course.yaml               ← Course metadata + module structure
│       │   ├── lessons/
│       │   │   ├── 0.1.mdx               ← "The Greenhouse Effect & Three Gases"
│       │   │   ├── 0.2.mdx               ← "Soil as a Carbon Bank"
│       │   │   ├── ...                   ← (34 lesson files total)
│       │   │   └── CAP.mdx               ← "Capstone Project"
│       │   └── quizzes/
│       │       ├── 0.1.yaml              ← Quiz for lesson 0.1
│       │       ├── 0.2.yaml
│       │       └── ...
│       ├── carbon-markets/               ← Future course (placeholder)
│       │   ├── course.yaml
│       │   ├── lessons/
│       │   └── quizzes/
│       └── _template/                    ← Template for new courses
│           ├── course.yaml
│           └── lessons/
│               └── 1.1.mdx
│
├── e2e/
│   ├── lesson-flow.spec.ts               ← Playwright: lesson → quiz → progress
│   ├── navigation.spec.ts                ← Playwright: sidebar, breadcrumbs, mobile
│   └── visual-regression.spec.ts         ← Playwright: screenshot comparisons
│
├── public/
│   └── images/                           ← Course images, diagrams
├── VCS/                                  ← Source PDFs (unchanged)
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
├── playwright.config.ts
├── package.json
└── CLAUDE.md                             ← Updated project instructions
```

---

## Data Models

### course.yaml (per course)

```yaml
id: vm0042
title: "VM0042 v2.2 — Improved Agricultural Land Management"
subtitle: "Master soil carbon quantification for ALM projects"
description: "A comprehensive course covering Verra's VM0042 methodology..."
icon: "🌾"
color: green
status: published            # published | draft | coming-soon
category: methodologies      # methodologies | markets | esg | fundamentals
estimatedHours: 55
modules:
  - id: 0
    title: "Foundations"
    subtitle: "Carbon, Climate & Agriculture"
    icon: "🌱"
    color: green
    lessons:
      - id: "0.1"
        title: "The Greenhouse Effect & Three Gases"
        duration: "30 min"
        vmRef: "Background"
      - id: "0.2"
        title: "Soil as a Carbon Bank"
        duration: "35 min"
        vmRef: "Background"
  # ... all modules
```

### Zod Schemas (build-time validation)

```ts
// lib/schemas.ts
import { z } from 'zod';

export const QuizQuestionSchema = z.object({
  question: z.string().min(1),
  options: z.array(z.string()).min(2).max(6),
  answer: z.number().int().min(0),
  explanation: z.string().min(1),
}).refine(q => q.answer < q.options.length, {
  message: "answer index must be within options range"
});

export const LessonMetaSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  duration: z.string(),
  vmRef: z.string().optional(),
});

export const ModuleSchema = z.object({
  id: z.number().int().min(0),
  title: z.string().min(1),
  subtitle: z.string(),
  icon: z.string(),
  color: z.string(),
  lessons: z.array(LessonMetaSchema).min(1),
});

export const CourseSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  subtitle: z.string(),
  description: z.string(),
  icon: z.string(),
  color: z.string(),
  status: z.enum(['published', 'draft', 'coming-soon']),
  category: z.enum(['methodologies', 'markets', 'esg', 'fundamentals']),
  estimatedHours: z.number().positive(),
  modules: z.array(ModuleSchema).min(1),
});
```

### Lesson MDX (per lesson)

```mdx
{/* content/vm0042/lessons/0.1.mdx */}

<HighlightBox>
Key takeaway content here — supports full MDX/JSX.
</HighlightBox>

## Section Heading

Regular markdown content with **bold**, *italic*, and `code`.

<FormulaBox>
$$\Delta C_{SOC} = C_{project} - C_{baseline}$$
</FormulaBox>

<ExampleBox title="Worked Example">
Step-by-step calculation...
</ExampleBox>

<AnalogyBox>
Think of soil carbon like a bank account...
</AnalogyBox>
```

### Quiz YAML (per lesson)

```yaml
# content/vm0042/quizzes/0.1.yaml
- question: "Which greenhouse gas is most abundant?"
  options:
    - "Methane"
    - "Carbon dioxide"
    - "Nitrous oxide"
    - "Water vapor"
  answer: 1          # 0-based index (unchanged from current)
  explanation: "CO2 is the most abundant anthropogenic greenhouse gas."
```

### TypeScript Types

```ts
// lib/types.ts
interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  status: 'published' | 'draft' | 'coming-soon';
  category: 'methodologies' | 'markets' | 'esg' | 'fundamentals';
  estimatedHours: number;
  modules: Module[];
}

interface Module {
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  lessons: LessonMeta[];
}

interface LessonMeta {
  id: string;
  title: string;
  duration: string;
  vmRef?: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}
```

---

## Progress System

### localStorage Schema (MVP) + Export/Import Safety Net

```ts
interface PlatformProgress {
  version: 2;
  courses: Record<string, CourseProgress>;
}

interface CourseProgress {
  startedAt: number;
  lastAccessedAt: number;
  lastAccessedLesson: string | null;
  completedLessons: Record<string, number>;    // lessonId → timestamp
  quizzes: Record<string, QuizState>;          // lessonId → quiz state
}

interface QuizState {
  answers: Record<number, number>;
  submitted: Record<number, boolean>;
  score?: number;
}
```

### Single localStorage key

```
Key: "verra_academy"
Value: PlatformProgress JSON
```

### Hydration Safety

Because localStorage is client-only and Next.js renders on the server (or at build time), progress-dependent UI must be deferred until after mount to prevent React hydration mismatches:

```ts
function useProgress(courseId: string) {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState<CourseProgress>(emptyProgress);

  useEffect(() => {
    // Only read localStorage after mount (client-side only)
    const stored = loadFromLocalStorage(courseId);
    setProgress(stored);
    setMounted(true);
  }, [courseId]);

  // Return zeros/defaults until mounted to avoid hydration mismatch
  if (!mounted) return defaultValues;

  return { /* real progress values */ };
}
```

### Progress Export/Import

To protect users who invest 55+ hours in a course from losing progress on browser clear or device switch:

```ts
// lib/progress-export.ts
export function exportProgress(): void {
  const data = localStorage.getItem("verra_academy");
  const blob = new Blob([data], { type: "application/json" });
  // Trigger download: verra-academy-progress-2026-03-03.json
}

export function importProgress(file: File): Promise<void> {
  // Read file, validate with Zod, merge into current progress
}
```

Accessible from a settings/profile icon in PlatformNav. Future upgrade path: swap localStorage backend for Supabase/Firebase with zero component changes.

### React hooks

```ts
// useProgress(courseId) — per-course operations
function useProgress(courseId: string) {
  return {
    isCompleted(lessonId: string): boolean,
    markComplete(lessonId: string): void,
    completedCount: number,
    totalLessons: number,
    percentComplete: number,
    getQuizState(lessonId: string): QuizState,
    saveAnswer(lessonId: string, qIndex: number, answer: number): void,
    submitAnswer(lessonId: string, qIndex: number): void,
    lastAccessedLesson: string | null,
    resetCourse(): void,
    resetQuiz(lessonId: string): void,
  }
}

// usePlatformProgress() — cross-course dashboard
function usePlatformProgress() {
  return {
    coursesStarted: string[],
    getCourseStats(courseId: string): CourseStats,
    overallStats: PlatformStats,
  }
}
```

### Migration from current localStorage

On first load, detect old keys (`vm0042_progress`, `vm0042_quiz_*`) and migrate them into the new schema automatically. Old keys are removed after successful migration.

---

## Page-by-Page Breakdown

### 1. Landing Page (`/`)

Platform home showing:
- Hero section with platform name and tagline
- **Global "Continue Learning" button** — jumps to most recent lesson across all courses
- **Course catalog split into two sections:**
  - **"My Courses"** — courses with any progress, showing progress bars and "Resume" CTAs
  - **"Explore Courses"** — unstarted courses, grouped by category (Methodologies, Markets, ESG, Fundamentals)
- Each card shows: icon, title, subtitle, progress bar, lesson count, estimated hours
- "Coming Soon" badge for draft courses
- **Search and filter** (by category, status) — becomes useful at 10+ courses
- Overall stats bar ("X lessons completed across Y courses")

### 2. Course Overview (`/courses/[courseId]`)

Replaces current HomeView. Shows:
- **Breadcrumb**: Platform Home > Course Name
- Course title, description, overall progress bar
- "Resume Course" CTA (uses `lastAccessedLesson`)
- Module cards grid with per-module progress
- Same visual structure as current HomeView but scoped to one course

### 3. Lesson Page (`/courses/[courseId]/[lessonId]`)

Replaces current LessonView. Shows:
- Sidebar (collapsible, same UX as current)
- **Breadcrumb**: Platform Home > Course > Module Name > Lesson Title
- Lesson metadata bar (lesson ID, module position, duration, source ref)
- MDX content rendered with custom components
- Quiz component at bottom
- "Mark Complete" button → auto-navigates to next lesson
- Prev/Next navigation (top and bottom)

### 4. Course Layout (`/courses/[courseId]/layout.tsx`)

Wraps all pages within a course:
- Course-specific sidebar
- Course-specific top bar with breadcrumbs
- Handles sidebar collapse state
- **Mobile**: full-screen drawer sidebar with focus trap and large tap targets

---

## Accessibility Requirements

These are non-negotiable for the initial build:

| Requirement | Implementation |
|---|---|
| **Keyboard navigation** | Full Tab/Enter/Space support for Quiz options, sidebar items, all buttons |
| **ARIA attributes** | `aria-expanded` + `aria-controls` on sidebar toggles, `role="radiogroup"` on quiz options |
| **Focus trap** | Mobile sidebar overlay traps focus; Escape key closes it |
| **Color contrast** | All callout box text/background combinations meet WCAG 2.1 AA (4.5:1 minimum) |
| **Heading hierarchy** | MDX content enforces proper `h2` → `h3` → `h4` nesting |
| **Responsive tables** | All `<table>` elements wrapped in `overflow-x-auto` container via mdx-components.tsx |
| **Skip link** | "Skip to content" link at top of every page |

---

## Implementation Phases (8–10 Days)

### Phase 1: Content Migration Tooling (Days 1–2)

**Build the automated migration pipeline before any UI work.**

1. Write `scripts/migrate-content.ts`:
   - Parse `VM0042_Learning_Module.html` using Babel/ts-morph to extract `MODULES` array and `LESSONS` object
   - Convert each `LESSONS[].content` HTML string to MDX:
     - `<div class="highlight-box">...</div>` → `<HighlightBox>...</HighlightBox>`
     - `<div class="analogy-box">...</div>` → `<AnalogyBox>...</AnalogyBox>`
     - `<div class="example-box">...</div>` → `<ExampleBox>...</ExampleBox>`
     - `<div class="formula-box">...</div>` → `<FormulaBox>...</FormulaBox>`
     - Preserve all other HTML (tables, lists, spans, etc.)
   - Extract each `LESSONS[].quiz` array → YAML file
   - Generate `course.yaml` from `MODULES` array
   - Output all files into `src/content/vm0042/`
2. Write `scripts/validate-content.ts`:
   - Validate `course.yaml` against Zod `CourseSchema`
   - Validate every quiz YAML against Zod `QuizQuestionSchema`
   - Verify every lesson ID in `course.yaml` has a corresponding `.mdx` file
   - Verify every lesson with a quiz has a corresponding quiz YAML
   - Check for broken component references in MDX files
3. Run migration script, manually verify 3–5 representative lessons
4. Fix any conversion edge cases (formula escaping, nested HTML structures)

### Phase 2: Scaffold & Infrastructure (Days 2–3)

1. Initialize Next.js 14 project with TypeScript, Tailwind, App Router
2. Set up MDX support (`@next/mdx` or `next-mdx-remote`)
3. Install dependencies: `zod`, `gray-matter`, `yaml`
4. Create `lib/types.ts` with all TypeScript types
5. Create `lib/schemas.ts` with Zod validation schemas
6. Create `lib/colors.ts` (migrate colorMap)
7. Create `lib/courses.ts` (course loader — reads course.yaml, validates with Zod, enumerates lessons)
8. Create `lib/progress.ts` (useProgress + usePlatformProgress + hydration safety)
9. Create `lib/progress-export.ts` (export/import JSON)
10. Set up `tailwind.config.ts` with custom theme
11. Configure `generateStaticParams` for `[courseId]` and `[lessonId]` routes

### Phase 3: Content Components (Days 3–4)

1. Create `HighlightBox`, `AnalogyBox`, `ExampleBox`, `FormulaBox` as proper React components with WCAG-compliant colors
2. Create `ResponsiveTable` component (wraps tables in `overflow-x-auto`)
3. Create `mdx-components.tsx` with strict component allowlist + table override
4. Create `Quiz` component (port from current, add TypeScript, full keyboard accessibility)
5. Create `ProgressBar`, `LessonNav`, `Breadcrumb` components

### Phase 4: Platform Shell (Days 4–5)

1. Create root layout with `PlatformNav` (logo, global "Continue Learning", settings/export)
2. Create landing page with "My Courses" / "Explore Courses" sections
3. Create `CourseCard` component with category badges
4. Create course category grouping and search/filter
5. Create `Footer`

### Phase 5: Course Pages (Days 5–6)

1. Create course layout (sidebar + topbar + breadcrumbs)
2. Port `Sidebar` component (add courseId awareness, aria attributes, mobile focus trap)
3. Create course overview page (module cards, resume CTA)
4. Create lesson page (MDX renderer + Quiz loader + prev/next navigation)
5. Wire up `generateStaticParams` for all routes

### Phase 6: Migration QA Gate (Days 6–7)

**All 34 lessons must pass before proceeding.**

1. Run `validate-content.ts` — all schemas pass
2. Visually compare every lesson against current live site (side-by-side)
3. Verify all quiz questions render correctly with correct answers
4. Test formula rendering and escaping (common breakage point)
5. Test responsive tables on mobile viewport
6. Fix any visual regressions discovered

### Phase 7: Progress & Integration Testing (Days 7–8)

1. Implement v1 → v2 localStorage migration
2. Manual testing:
   - Progress persistence across navigation
   - Quiz state persistence across page reload
   - "Resume Course" and "Continue Learning" from all entry points
   - Mobile sidebar (open, close, focus trap, tap-outside)
   - Progress export/import round-trip
3. Write Playwright E2E tests:
   - `lesson-flow.spec.ts`: navigate to lesson → answer quiz → mark complete → auto-advance
   - `navigation.spec.ts`: sidebar, breadcrumbs, prev/next, mobile drawer
   - `visual-regression.spec.ts`: screenshot comparisons for key pages
4. Cross-browser test (Chrome, Safari, Firefox)

### Phase 8: Deploy & Verify (Days 8–9)

1. Update Vercel project settings for Next.js
2. Deploy to Vercel
3. Verify live site matches current functionality
4. Run Playwright tests against production URL
5. Update CLAUDE.md with new project structure
6. Update README with contributor guide for adding courses

### Buffer (Day 10)

Reserved for fixing issues discovered in production, accessibility audit cleanup, or polish.

---

## Automated Content Migration Script

The migration script is the **highest-risk, highest-value** piece. Key design:

```ts
// scripts/migrate-content.ts
// 1. Parse the single HTML file
//    - Use Babel parser or ts-morph to extract MODULES and LESSONS from the <script> block
//    - This avoids fragile regex on 4860 lines of mixed HTML/JS

// 2. Transform HTML content to MDX
//    - Use unified + rehype-parse to parse each lesson's HTML string into an AST
//    - Walk the AST and replace known div.class patterns with MDX components
//    - Serialize back to MDX-compatible string

// 3. Extract quiz data
//    - Map each LESSONS[id].quiz array to YAML format
//    - Validate with Zod before writing

// 4. Generate course.yaml
//    - Map MODULES array to YAML with proper lesson references

// Edge cases to handle:
//    - Nested HTML inside callout boxes (e.g., <ul> inside highlight-box)
//    - Formula strings containing special MDX characters (curly braces, angle brackets)
//    - Inline styles that need to be converted to Tailwind classes
//    - The CAP lesson ID (not numeric like others)
//    - Tables with colspan/rowspan
```

---

## Adding a New Course (Post-Migration)

After the platform is built, adding a course is purely a content task:

```bash
# 1. Copy the template
cp -r src/content/_template src/content/my-new-course

# 2. Edit course.yaml with metadata and module structure
# 3. Write lesson .mdx files
# 4. Write quiz .yaml files
# 5. Run validation
npx ts-node scripts/validate-content.ts

# 6. Deploy — no code changes needed (auto-discovered)
```

The course loader auto-discovers all courses in `src/content/` that have a valid `course.yaml`.

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 14 (App Router) | SSG, file routing, Vercel-native; confirmed over Astro/Vite/Remix |
| Content format | MDX + YAML | Readable, editable by non-devs, no backtick bugs |
| Content validation | Zod schemas at build time | Catch YAML typos and schema drift before deploy |
| Styling | Tailwind CSS | Already using it, zero migration friction |
| State management | React hooks + localStorage | Simple, no backend needed yet |
| Hydration safety | Deferred rendering via useEffect mount check | Prevents SSG/client mismatch on progress bars |
| Progress safety net | Export/import JSON file | Protects 55+ hour investments from browser clear |
| Quiz data | Separate YAML files | Editable independently from lesson content |
| Routing | `/courses/[courseId]/[lessonId]` | Clean URLs, shareable links |
| Progress key | Single `verra_academy` | One key for all courses, schema versioned |
| Build output | Static (SSG) | No server needed, fast, cheap hosting |
| Migration approach | Automated script (Babel + unified) | Manual conversion of 34 lessons is error-prone |
| Testing | Playwright E2E + visual regression | Catches migration regressions systematically |
| Accessibility | WCAG 2.1 AA compliance | Keyboard nav, ARIA, contrast, focus management |

---

## What Stays the Same

- Visual design (Tailwind classes, color scheme, content box styles)
- Quiz UX (select → check → feedback → score)
- Sidebar behavior (collapsible, auto-expand active module, mobile overlay)
- Progress tracking logic (mark complete → auto-advance)
- All VM0042 lesson content (reformatted as MDX via automated script)
- Vercel deployment target

## What Changes

- Single HTML file → proper project structure
- Template literal content → MDX files (automated migration)
- No types → full TypeScript with Zod validation
- CDN React/Babel → bundled Next.js
- Single course hardcoded → dynamic multi-course with category grouping
- Flat localStorage → structured schema with migration + export/import
- Manual sync (`cp`) → automatic build pipeline
- No tests → Playwright E2E + visual regression
- Minimal accessibility → WCAG 2.1 AA compliance

---

## Future Capabilities Unlocked

Once the platform is running, these become straightforward additions:

| Feature | Approach |
|---------|----------|
| Search across courses | Index MDX content at build time |
| User accounts | Add NextAuth + database, swap localStorage backend in `progress.ts` |
| Certificates | Generate PDF via API route on course completion |
| Content CMS | Connect Contentlayer or Sanity for non-dev editing |
| Analytics | Add Vercel Analytics or PostHog |
| i18n | `1.1.en.mdx` / `1.1.es.mdx` pattern |
| Discussion/comments | API route + lightweight DB per lesson |
| Spaced repetition | Resurface quiz questions based on timing algorithms |

---

## Verification Plan

After implementation, verify:

1. **Content validation passes**: `npx ts-node scripts/validate-content.ts` — zero errors
2. **Build succeeds**: `npm run build` completes without errors or warnings
3. **All 34 VM0042 lessons render**: Navigate to each lesson, confirm content matches current site
4. **All quizzes work**: Answer questions, check persistence across navigation
5. **Progress persists**: Complete lessons, refresh browser, confirm state
6. **Migration works**: Set old `vm0042_progress` in localStorage, load site, confirm migration
7. **Export/import works**: Export progress, clear localStorage, import, verify restoration
8. **Mobile works**: Sidebar drawer, focus trap, tap-outside-to-close, responsive tables
9. **Accessibility**: Keyboard-only navigation through entire lesson→quiz→complete flow
10. **Course catalog**: Landing page shows "My Courses" / "Explore" sections correctly
11. **Continue Learning**: Global button navigates to correct lesson across courses
12. **Breadcrumbs**: Correct at every depth (home, course, lesson)
13. **Playwright passes**: All E2E tests green
14. **Deploy**: `vercel --prod` serves the Next.js app correctly
15. **Visual comparison**: Side-by-side with current live site — no content regressions
