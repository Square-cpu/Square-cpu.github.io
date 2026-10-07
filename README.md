# Arthur Milander — portfolio foundation

Phase 2E: the complete V1 homepage has received a responsive and visual polish pass. The Phase 1 static Astro 7 foundation, Phase 2A visual system and Header/Index, Phase 2B opening, Phase 2C exhibition, and Phase 2D lower homepage remain intact. Factual content and real media remain provisional. TypeScript, plain CSS, six placeholder project entries, and isolated vanilla-JavaScript navigation remain intact. No UI framework, animation library, or backend.

## Local development

Use Node 22.12+ (Node 24 recommended) and npm. Commit `package-lock.json`.

```sh
npm ci
npm run dev
npm run check
npm run build
npm run verify:links
npm run preview
```

`npm run check` validates Astro and TypeScript; the production build also validates collection schemas and generates all 12 routes. Development and preview default to port 4321.

## Where things live

```text
src/
  content.config.ts         Validated Content Layer collection
  content/projects/*.md    Project frontmatter and case-study bodies
  data/                    Site/contact links and exploring topics
  lib/                     Base-aware paths and collection queries
  components/
    common/                Shared contact links
    home/                  Eight independent homepage sections
    navigation/            Native dialog Index
    projects/              Typed preview with a media slot
    interactive/           Replaceable HeroVisual boundary
    experiments/           Future standalone experiments
  layouts/                 Shared document and flexible project layout
  pages/                   Main routes and dynamic project pages
  styles/                  Central tokens and global primitives
public/favicon.svg         Temporary AM favicon
tests/                     Browser regression checks
scripts/check-links.mjs    Built local links, assets, and anchors
docs/deploy.yml.example    Ready-to-enable official Pages workflow
```

## Content and presentation

Projects use Astro's current `glob()` loader in `src/content.config.ts`, `getCollection()`, and `render()`. Files generate IDs used by `/projects/[...slug]`; the rest parameter also supports nested IDs later. All three project surfaces exclude drafts. The homepage sorts featured entries by `featuredOrder`; the archive sorts known years descending, then titles, placing unknown years last.

Year and role are optional because neither has been supplied. Technologies, categories, links, and status stay empty/unset rather than implying facts. The homepage omits unknown metadata; the archive and project pages retain their explicit placeholders. All six entries intentionally publish as clearly marked placeholders; `draft: true` removes an entry from all generated routes and lists.

Add a project by creating a Markdown file with `title` and `summary`. Add `featured: true` and `featuredOrder` for homepage inclusion. Optional fields are documented directly in the schema. `cover.src` resolves a local image relative to the content file and requires descriptive `cover.alt`. Render real images through Astro's `Image` component with meaningful alt text; mark truly decorative images explicitly in their own components.

Visual variants belong in components or a separate presentation map keyed by project ID, rather than adding layout instructions to content. `ProjectPreview` has a typed project/context interface and an optional media slot. Replace it, or select different preview components in Selected Work, without rewriting project files.

`ProjectLayout` accepts normal Astro content plus `media`, `experiments`, and `project-navigation` slots. Only the current Markdown body is inside `.prose`; rich media can use the full content width. For case studies needing components inside their body, add the official `@astrojs/mdx` integration and extend the loader to `**/*.{md,mdx}`. Alternatively compose an Astro component in the dynamic route using the existing slots. No island framework is required until a particular interaction warrants one. Keep scripts local to the owning component and clean up long-lived listeners if client-side routing is ever introduced.

Playground is intentionally independent of the project schema. Experiences, Awards, and About remain simple page structures until real content reveals which fields are useful. Shared contact links live in `src/data/site.ts`; no fake contact addresses are included.

## Interaction and accessibility

The Index uses `dialog.showModal()` for native focus containment, background inertness, and Escape dismissal. Opening locks page scrolling; closing restores focus to INDEX. Normal links perform full document navigation. Without JavaScript, INDEX links to a footer navigation list. Exploring uses native `details`/`summary`, keeping topics visible while collapsed. Decorative feedback stays local to its component and uses shared motion tokens; global reduced-motion rules disable transitions and animations.

Tokens centralize color, spacing, type, widths, borders, radii, motion, and layers. A skip link, visible focus, semantic landmarks, and responsive layouts are shared across pages.

## Phase 2A visual system

`src/styles/tokens.css` owns the provisional theme. Background/surfaces use `#11110f`, `#171714`, and `#1d1d19`; text is `#f0eee8`, readable muted text `#9f9c94`, and decorative faint detail `#6f6d67`. Borders use `#2d2c28` / `#46443e`. The warm `#e1c98f` keyboard outline stays clearly visible. Faint and border colors must not be used for essential text.

Two font dependencies are self-hosted through CSS imports in `global.css`: `@fontsource-variable/instrument-sans` (normal variable weight 400–700) and `@fontsource/ibm-plex-mono` (Latin, normal 400 only). No external font service is contacted. Replace those imports and the `--font-body` / `--font-mono` tokens to change families. [Fontsource's installation documentation](https://fontsource.org/docs/getting-started/install) describes the package approach. System fallbacks and `font-display: swap` keep content available during loading.

Typography scales with `clamp()`: body 17–19px, metadata 12–14px, section headings 32–72px, page/display titles 44–120px, Index titles 30–72px. Navigation uses sans-serif; numbering and labels use mono. Geometry tokens are 2/4/7px, with only a tiny radius applied to controls.

`.shell` caps content at 1472px and uses gutters `clamp(16px, 4vw, 64px)`. `.layout-grid` supplies four mobile columns and twelve at 768px+, with local components choosing their own spans. The 96–160px `--space-section` token is available for future compositions; existing placeholder sections retain their modest spacing. `--space-page`, `--space-content`, and `--space-ui` cover other rhythms. `SectionLabel.astro` supports optional numbering and a ruled variant without prescribing a whole section layout.

The 72px sticky header uses an opaque background and thin rule, without scroll JavaScript or blur. The full name fits at 320px. The native fullscreen Index has large ruled rows, a small dot and stronger text/rule for the current section, and a 4px text shift on hover/focus. Entrance motion lasts 560ms; closing is immediate so native Escape/focus behavior is not delayed. Feedback tokens are 140/280/560ms; reduced motion removes transitions and animation. Short screens scroll naturally inside the dialog.

`sectionCurrent()` in `src/lib/paths.ts` strips the configured base by whole path segments and matches section boundaries. Exact routes use `aria-current="page"`; descendants use `aria-current="true"`. Home matches only the local root. Similar prefixes such as `projects-other` never activate Projects.

Links retain underlines and clear keyboard outlines. Existing continuation/back arrows remain; use `→` for continuation, `↗` for future external links, `↓` for disclosure, and `←` for return where helpful. Decorative symbols should be hidden from assistive technology when the link text already explains the action.

## Phase 2B opening

Hero and About remain separate components but share an asymmetric grid relationship without a dividing rule. The name uses an intentional two-line setting, with a 60–88px mobile scale and 72–120px desktop scale. At 768px+ the Hero pairs seven columns of copy with a five-column visual region. Below that, the study stacks and becomes smaller, aligned to the right. About offsets its lead text and supporting paragraph on desktop and follows a simple reading order on mobile.

Provisional Hero/About text lives in `src/data/opening.ts`, based only on supplied interests. Replace it there without changing layout. It is a working introduction, not a completed biography. The dedicated About page remains a placeholder.

`HeroVisual.astro` is a replaceable, decorative SVG study: fourteen tiles in a four-by-four construction with two empty corners, four simple line motifs, small edge highlights, and existing theme tokens. It uses no JavaScript or new assets. Fine-pointer hover shifts only a tile's linework by 2px; reduced motion disables that shift. The static composition works on touch and without JavaScript. The entire study is `aria-hidden` with no focusable controls because it conveys no factual content.

Currently Exploring keeps native `details`/`summary`. All topics remain visible while collapsed, arranged as separate lines on narrow screens. The expanded layer uses three columns on desktop and stacked ruled entries on mobile. Descriptions are provisional questions/directions, not achievements. `src/data/exploring.ts` retains title, description, optional link, and optional ISO last-updated date. No dates or links have been invented. The summary has an explicit topic-based accessible name; the decorative arrow rotates with the native open state. A feature-gated [CSS disclosure layer](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::details-content) fades content on supported browsers; others use ordinary native disclosure. Motion durations come from the existing tokens and become zero under reduced motion.

Phase 2B screenshots live in `artifacts/phase-2b/`. For each width 320/360/390/430/768/1280/1440/1920, tests capture `home-{width}.png` (full page), `hero-{width}.png` (first viewport), `opening-{width}.png` (the entire first three sections), `about-{width}.png`, `exploring-collapsed-{width}.png`, and `exploring-expanded-{width}.png` (the full expanded section). The opening tests also cover keyboard and touch disclosure, full description visibility, decorative reduced-motion feedback, overflow, and sticky-header continuity. No dependencies were added in Phase 2B.

## Phase 2C Selected Work

The homepage exhibition follows `featuredOrder`: WFC, TKS / UN, Motion Lab, ENEM, Asteroid Watchers, and iFood Hackathon. `src/lib/project-selection.ts` filters non-featured entries and drafts, sorts a fresh array, and falls back to title ordering. The archive retains its independent chronological/title organization and existing preview layout.

`src/data/featured-presentation.ts` maps project IDs to a small typed pair of layout variant and abstract study. These homepage choices never enter project frontmatter. `ProjectPreview.astro` keeps a shared project interface and media slot, with its archive branch unchanged. The exhibition uses a wide WFC anchor, offset TKS/Motion pairing, inset ENEM ribbon, and open orbital NASA study beside a compact iFood preview. Mobile follows collection order while retaining different media proportions and rule treatments.

`ProjectStudy.astro` draws six lightweight decorative SVG motifs: modular tiles, layered fields, timing intervals, information blocks, orbital geometry, and connected groups. Each is visibly labeled “Abstract study / media to come”; none depicts a project result or real interface. Replace the slotted study with real media later, providing descriptive alt text where the media communicates content. Existing TODO summaries are preserved, and no years, roles, technologies, or outcomes are invented.

Each preview has one descriptive project link within its `h3`. Its stretched hit area covers the preview, making media usable on touch without extra tab stops. Keyboard focus outlines the full preview; the continuation arrow stays visible. Fine-pointer hover and focus move linework by 4px and brighten its tone. Reduced motion removes the shift and transitions. No scripts, assets, or dependencies were added.

`tests/selected-work.spec.ts` covers selection/order, full accessible project names, all six routes, archive continuation, keyboard traversal, touch, reduced motion, and overflow at 320/360/390/430/768/1024/1280/1440/1920px. The same suite runs under `BASE_PATH` for subpath verification. Review captures live in `artifacts/phase-2c/`: `selected-work-{width}.png`, `home-{width}.png`, and `transition-{width}.png`, plus WFC hover/focus states at 320/1440px. Section crops hide fixed navigation only for capture; full-page and transition captures retain the actual header.

## Phase 2D lower homepage

Experience resets the exhibition grid into a heading and three stepped, horizontally ruled entries. `src/data/experiences.ts` holds the provisional Behring Academy, TKS, and Future Lab outline from existing content. Dates and sequence are explicitly unconfirmed; no chronology or achievements have been invented. Add verified years and context there later. This data is currently homepage-only; the dedicated Experiences page remains unchanged.

Playground arranges four decorative slots within the grid: a frame strip, wire form, line study, and tile fragment. `PlaygroundArtifact.astro` uses small SVG constructions with existing palette tokens. Visible “Placeholder” captions and introductory text distinguish them from Arthur's actual work. Mobile retains the same reading order, pairing the two smaller studies diagonally between the frame strip and offset tile fragment. The wire form rotates 3 degrees and shifts 4px on fine-pointer hover or when the section's continuation link has focus; reduced motion removes both. Decorative media creates no focus stops. No client code is required.

Recognition uses a compact semantic table beside its heading. `src/data/recognition.ts` supports name, result, optional year/level/link, and featured selection. The array stays empty until verified records are supplied; the homepage shows an explicit TODO row instead of invented award history. The dedicated Awards page remains unchanged.

Only the homepage receives the new full-width footer treatment. “Want to talk?” sits opposite the contact area; the final line contains Arthur's name, the build year, and a replaceable decorative `FooterMark.astro`. `site.contactLinks` remains the source of verified destinations. With no supplied values, the footer variant of `ContactLinks` renders plain Email/GitHub/LinkedIn/YouTube labels marked “To add”, never fake links. Default contact rendering in the Index and dedicated pages is preserved. The no-JavaScript footer Index remains available without repeating navigation for ordinary visitors.

`tests/lower-home.spec.ts` checks the three preview destinations under the configured base, provisional records and contact values, keyboard traversal, decorative semantics, reduced motion, no-JavaScript behavior, and overflow. Captures at 320/360/390/430/768/1024/1280/1440/1920px live in `artifacts/phase-2d/`: `experience-{width}.png`, `playground-{width}.png`, `recognition-{width}.png`, `footer-{width}.png`, `lower-home-{width}.png`, and `home-{width}.png`. `playground-hover-1440.png` captures the optional feedback. Section/lower-page crops hide fixed navigation for capture only; full-page images retain the actual header. No dependencies were added.

## Browser checks

```sh
npx playwright install chromium
npm run build
npm test
```

Alternatively set `PLAYWRIGHT_CHANNEL=msedge` or `chrome` to use an installed browser. In PowerShell: `$env:PLAYWRIGHT_CHANNEL = 'msedge'`. Tests start a fresh production preview automatically. They cover keyboard navigation, focus containment/restoration, Escape, close button, disclosure, no-JavaScript fallback, all routes, reduced motion, sticky header, active sections, and widths 320/360/390/430/768/1280/1440/1920. A short 320×568 viewport checks dialog scrolling. Screenshots go to ignored `artifacts/phase-2a/`: `page-{width}.png` (viewport), `home-{width}.png` (full page), `sticky-{width}.png` (after scrolling), and `index-{width}.png`. Failures go to `artifacts/test-results/`.

## GitHub Pages — enable when the repository is known

No deployment is active and no production URL is invented. The configuration reads shell environment variables `SITE_URL` (origin) and `BASE_PATH` (path, defaults to `/`). Canonical and Open Graph URL tags are omitted until `SITE_URL` exists. Set these in the shell or CI; `.env` files are not automatically read by this config.

1. Choose the repository and its default branch.
2. Add repository Actions variables: `SITE_URL` = your real Pages origin, including `https://`; `BASE_PATH` = `/` for a user site, or `/repository-name` for a project site.
3. Move `docs/deploy.yml.example` to `.github/workflows/deploy.yml`. Adjust the `main` trigger if necessary.
4. Set repository Settings → Pages → Source to GitHub Actions.
5. Push the source and lockfile. The official `withastro/action` builds/uploads the static artifact; `actions/deploy-pages` deploys it.

Internal routes and public assets use `withBase()`. Use that helper for new links and public assets; imported Astro assets are handled by Astro. Test a subpath locally before deploying:

```powershell
$env:BASE_PATH = '/portfolio-test'
$env:SITE_URL = 'https://example.invalid'
npm run build
npm run verify:links
npm test
Remove-Item Env:BASE_PATH
Remove-Item Env:SITE_URL
npm run build
```

The reserved `.invalid` origin is for this local verification example only. It is never a production default. A custom domain normally uses `/` for the base; configure the real origin and DNS/CNAME when that decision is made.

Official references: [Content Collections](https://docs.astro.build/en/guides/content-collections/) and [GitHub Pages deployment](https://docs.astro.build/en/guides/deploy/github/).

## Dependency audit note

Phase 2A audit recheck (2026-10-05): `npm audit` reports one high-severity entry for the existing transitive `http-cache-semantics` advisory, [GHSA-ch52-4w7c-c8xp](https://github.com/advisories/GHSA-ch52-4w7c-c8xp), and indicates a fix is available. The font installation changed only the two font packages; the existing dependency graph was otherwise preserved. Review the available patch in a dependency maintenance pass. This site ships static files with no authenticated server or shared response cache; this dependency is not deployed as a server on GitHub Pages.

## Phase 2E polish

Reviewed the complete homepage and section transitions at 320/360/390/430/768/1024/1280/1440/1920px before editing. The existing compositions, asymmetric grid, section spacing, large type, header, Index, and footer worked without restructuring or shortening the page.

Currently Exploring now uses wrapping flex groups with token-based gaps around its muted separators. All topics remain visible, mobile keeps its stacked presentation, and native disclosure semantics and data are unchanged. Homepage continuation links have a minimum 44px touch height through `--size-touch-target`, scoped to `.home-page` so dedicated pages retain their styling. The Selected Work abstract-media captions keep their explicit wording in quieter sentence case, with less letter spacing and vertical padding. No dependencies or runtime scripts were added.

`tests/polish.spec.ts` checks mobile continuation targets and focus visibility, topic separation and wrapping at intermediate widths, keyboard disclosure, and complete-page captures. Existing suites retain their keyboard, reduced-motion, base-path, route, and overflow coverage. Screenshots live in `artifacts/phase-2e/`: `home-{width}.png` at all nine widths, `top-1440.png`, `selected-work-1440.png`, `lower-home-1440.png`, and `exploring-collapsed-{width}.png` at 520/640/768/1024/1440px. Initial captures are retained in `before/`; subpath verification captures use `base/`.

Phase 2E verification: Astro/TypeScript check passed without diagnostics, all 12 routes built, local link verification passed at `/` and `/portfolio-test`, and all 68 Playwright tests passed under both bases. Keyboard and reduced-motion states were also visually reviewed. The root build was restored after subpath verification.

## Remaining content and media work

Final copy, verified project/experience/award facts, media, contact details, and advanced interactions remain future work. Supply the production origin and base before enabling deployment. Open Graph artwork remains to be designed.
