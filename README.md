# Arthur Milander — portfolio foundation

Phase 3C/3D: the approved Phase 2 homepage now uses Arthur's supplied opening copy, current interests, six project summaries and real media, three learning experiences, five recognition groups, and public external links. The static Astro 7 architecture and Phase 2 compositions remain intact. Dedicated-page design/copy, deeper case studies, and Playground content remain future work. TypeScript, plain CSS, Content Collections, and isolated vanilla JavaScript remain the foundation. No UI framework, animation library, or backend.

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
  assets/projects/         Permanent project images and video poster
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
public/media/projects/     Permanent project video derivative
tests/                     Browser regression checks
scripts/check-links.mjs    Built local links, assets, and anchors
docs/deploy.yml.example    Ready-to-enable official Pages workflow
```

## Content and presentation

Projects use Astro's current `glob()` loader in `src/content.config.ts`, `getCollection()`, and `render()`. Files generate IDs used by `/projects/[...slug]`; the rest parameter also supports nested IDs later. All three project surfaces exclude drafts. The homepage sorts featured entries by `featuredOrder`; the archive sorts known years descending, then titles, placing unknown years last.

Year and role remain optional. The six featured entries contain supplied summaries and verified context; recorded project years are 2026 for WFC, Pasture Intelligence, and Motion Lab, and 2025 for Asteroid Watchers. ENEM and iFood currently omit project year metadata. The supplied 2026 iFood camp result is preserved in the Behring experience notes. Supplied technologies are recorded for Pasture Intelligence and ENEM without adding homepage technology lists. Optional `context` and `result` fields hold portable project facts. Case-study bodies still explicitly request future content; `draft: true` removes an entry from all generated routes and lists.

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

Hero/About text lives in `src/data/opening.ts`. Phase 3A uses Arthur's supplied introduction without changing layout. Replace it there when needed. The dedicated About page remains a placeholder.

`HeroVisual.astro` is a replaceable, decorative SVG study: fourteen tiles in a four-by-four construction with two empty corners, four simple line motifs, small edge highlights, and existing theme tokens. It uses no JavaScript or new assets. Fine-pointer hover shifts only a tile's linework by 2px; reduced motion disables that shift. The static composition works on touch and without JavaScript. The entire study is `aria-hidden` with no focusable controls because it conveys no factual content.

Currently Exploring keeps native `details`/`summary`. All topics remain visible while collapsed, arranged as separate lines on narrow screens. The expanded layer uses three columns on desktop and stacked ruled entries on mobile. Phase 3A supplies Procedural Generation, Animation, and Machine Learning with Arthur's descriptions. `src/data/exploring.ts` retains title, description, optional link, and optional ISO last-updated date. No dates or links have been invented. The summary has an explicit topic-based accessible name; the decorative arrow rotates with the native open state. A feature-gated [CSS disclosure layer](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/::details-content) fades content on supported browsers; others use ordinary native disclosure. Motion durations come from the existing tokens and become zero under reduced motion.

Phase 2B screenshots live in `artifacts/phase-2b/`. For each width 320/360/390/430/768/1280/1440/1920, tests capture `home-{width}.png` (full page), `hero-{width}.png` (first viewport), `opening-{width}.png` (the entire first three sections), `about-{width}.png`, `exploring-collapsed-{width}.png`, and `exploring-expanded-{width}.png` (the full expanded section). The opening tests also cover keyboard and touch disclosure, full description visibility, decorative reduced-motion feedback, overflow, and sticky-header continuity. No dependencies were added in Phase 2B.

## Phase 2C Selected Work

The homepage exhibition follows `featuredOrder`: WFC, TKS / UN, Motion Lab, ENEM, Asteroid Watchers, and iFood Hackathon. `src/lib/project-selection.ts` filters non-featured entries and drafts, sorts a fresh array, and falls back to title ordering. The archive retains its independent chronological/title organization and existing preview layout.

`src/data/featured-presentation.ts` maps project IDs to a small typed pair of layout variant and abstract study. These homepage choices never enter project frontmatter. `ProjectPreview.astro` keeps a shared project interface and media slot, with its archive branch unchanged. The exhibition uses a wide WFC anchor, offset TKS/Motion pairing, inset ENEM ribbon, and open orbital NASA study beside a compact iFood preview. Mobile follows collection order while retaining different media proportions and rule treatments.

`ProjectStudy.astro` draws six lightweight decorative SVG motifs: modular tiles, layered fields, timing intervals, information blocks, orbital geometry, and connected groups. Each is visibly labeled “Abstract study / media to come”; none depicts a project result or real interface. Replace the slotted study with real media later, providing descriptive alt text where the media communicates content. Existing TODO summaries are preserved, and no years, roles, technologies, or outcomes are invented.

Each preview has one descriptive project link within its `h3`. Its stretched hit area covers the preview, making media usable on touch without extra tab stops. Keyboard focus outlines the full preview; the continuation arrow stays visible. Fine-pointer hover and focus move linework by 4px and brighten its tone. Reduced motion removes the shift and transitions. No scripts, assets, or dependencies were added.

`tests/selected-work.spec.ts` covers selection/order, full accessible project names, all six routes, archive continuation, keyboard traversal, touch, reduced motion, and overflow at 320/360/390/430/768/1024/1280/1440/1920px. The same suite runs under `BASE_PATH` for subpath verification. Review captures live in `artifacts/phase-2c/`: `selected-work-{width}.png`, `home-{width}.png`, and `transition-{width}.png`, plus WFC hover/focus states at 320/1440px. Section crops hide fixed navigation only for capture; full-page and transition captures retain the actual header.

## Phase 2D lower homepage

Experience resets the exhibition grid into a heading and three stepped, horizontally ruled entries. Phase 3C populated the existing composition with supplied Behring Academy, The Knowledge Society (TKS), and Future Lab periods and summaries. `src/data/experiences.ts` now exports reusable full records and a featured selection; richer notes are stored for later dedicated-page work. The dedicated Experiences page remains unchanged.

Playground arranges four decorative slots within the grid: a frame strip, wire form, line study, and tile fragment. `PlaygroundArtifact.astro` uses small SVG constructions with existing palette tokens. Visible “Placeholder” captions and introductory text distinguish them from Arthur's actual work. Mobile retains the same reading order, pairing the two smaller studies diagonally between the frame strip and offset tile fragment. The wire form rotates 3 degrees and shifts 4px on fine-pointer hover or when the section's continuation link has focus; reduced motion removes both. Decorative media creates no focus stops. No client code is required.

Recognition uses a compact semantic table beside its heading. Phase 3C populated five featured groups from `src/data/recognition.ts`, which now holds grouped results, optional year/period/level/project/detail, category, ordering, and compact summaries. Dates sit beside their results rather than in a separate column, keeping multi-year groups precise. The dedicated Awards page remains unchanged.

Only the homepage receives the full-width footer treatment. “Want to talk?” sits opposite the contact area; the final line contains Arthur's name, the build year, and a replaceable decorative `FooterMark.astro`. `site.contactLinks` supplies the public GitHub, LinkedIn, and YouTube destinations added in Phase 3D. No email is published. Shared contact content also appears in the Index and About without changing their layouts. The no-JavaScript footer Index remains available without repeating navigation for ordinary visitors.

`tests/lower-home.spec.ts` checks the three preview destinations under the configured base, supplied records and contact values, keyboard traversal, decorative semantics, reduced motion, no-JavaScript behavior, and overflow. Captures at 320/360/390/430/768/1024/1280/1440/1920px live in `artifacts/phase-2d/`: `experience-{width}.png`, `playground-{width}.png`, `recognition-{width}.png`, `footer-{width}.png`, `lower-home-{width}.png`, and `home-{width}.png`. `playground-hover-1440.png` captures the optional feedback. Section/lower-page crops hide fixed navigation for capture only; full-page images retain the actual header. No dependencies were added.

## Browser checks

```sh
npx playwright install chromium
npm run build
npm test
```

Alternatively set `PLAYWRIGHT_CHANNEL=msedge` or `chrome` to use an installed browser. In PowerShell: `$env:PLAYWRIGHT_CHANNEL = 'msedge'`. Tests start a fresh production preview automatically. Set `PLAYWRIGHT_PORT` (for example, `4323`) if a development server already occupies 4321. They cover keyboard navigation, focus containment/restoration, Escape, close button, disclosure, no-JavaScript fallback, all routes, reduced motion, sticky header, active sections, and widths 320/360/390/430/768/1024/1280/1440/1920. A short 320×568 viewport checks dialog scrolling. Screenshots go to ignored phase-specific `artifacts/` folders; failures go to `artifacts/test-results/`.

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

## Phase 3A/3B copy and real project media

`ProjectMedia.astro` fills the existing preview media slot from validated `cover` and optional `previewVideo` content. `SelectedWork` retains `ProjectStudy` as a fallback when a future featured project has no real cover. Homepage variants and ordering remain separate from content in the existing presentation map. The archive layout and individual project-page architecture are unchanged; their existing basic cover area can now show the supplied image.

Permanent images live in `src/assets/projects/`, with the Motion Lab MP4 in `public/media/projects/motion-lab/`. [The complete source-to-production mapping](docs/project-media.md) documents every copied screenshot and the video derivative. Components never reference `artifacts/phase-3_images/`. Originals remain unchanged. Extra ENEM, Asteroid Watchers, and iFood screenshots are stored for future case studies without being imported into the homepage.

Astro generates responsive WebP images at quality 90, with intrinsic dimensions, lazy loading, and widths capped at the source dimensions. [Astro's image pipeline](https://docs.astro.build/en/guides/images/) handles imported assets and deployment-base URLs. WFC fills its existing feature region; scientific plots and UI previews retain their complete image through `contain` and source-specific proportions. Five still images have descriptive alt text. The Motion Lab preview is decorative because its surrounding title and summary explain its purpose.

The silent, cropped Motion Lab recording loads only when visible. It plays muted, loops, and uses `playsinline`; a keyboard-accessible Play/Pause control lets visitors stop the motion. Leaving the viewport or backgrounding the tab pauses playback. Reduced-motion visitors receive the real poster without automatic playback or downloading the video; optional manual playback does not loop. Without JavaScript, the poster remains and the unavailable control is hidden. No dependencies were added.

`tests/real-media.spec.ts` checks supplied copy, all six real previews, alt text and responsive asset paths, delayed video loading, manual pause, live reduced-motion changes, no-JavaScript posters, and overflow at all nine widths. Captures live in `artifacts/phase-3ab/`, with subpath captures in `base/`. Phase 2 sections outside the supplied copy/media scope remain intact.

## Phase 3C/3D experience, recognition, and public links

Experience records separate the homepage `summary` from future-page `highlights`. Behring Academy (2024–2026), TKS (2025–2026), and Future Lab (2026) are the only featured entries, selected by `featured` and `featuredOrder`. The supplied PIC Jr./Hotel de Hilbert context is a non-featured experience with an approximate duration and no invented year. Future Lab uses only Arthur's supplied context; no external organization or URL is inferred.

Recognition stores 13 groups and 29 result records across Computing, Mathematics, Science, Languages, Projects & Fairs, and School Recognition. The homepage selects OBI, OBMEP, NASA Space Apps, OBOI, and ONC in that order. OBI's 30th-place result is explicitly scoped to the 2024 Programming Level 1 final ranking. OBMEP's regional bronze remains in full data only. UFU and CCL retain absent years. Grau Ouro uses the supplied 2016–2025 period. Hotel de Hilbert remains an experience, not an award.

`BrandIcon.astro` contains three small local monochrome SVG marks using `currentColor`. They are decorative beside visible text, hidden from assistive technology, and create no focus stops. Contact links use ordinary same-tab anchors, the existing external arrow, visible focus, and minimum 44px targets. GitHub is `https://github.com/Square-cpu`, LinkedIn is `https://www.linkedin.com/in/arthur-milander/`, and YouTube is `https://www.youtube.com/@Square_SQ`. No email, phone, Instagram, Substack, photo, or private contact data was added. No dependencies or runtime JavaScript were added.

`tests/home-content.spec.ts` checks featured filtering and ordering, exact supplied copy and periods, five recognition groups, scoped ranking, shared public URLs, decorative icons, placeholder removal, keyboard/touch access, and overflow. Captures at 320/390/768/1024/1440/1920px are in `artifacts/phase-3cd/`, with subpath captures in `base/`. The dedicated routes and previous homepage designs remain intact.

Phase 3C/3D verification: Astro/TypeScript passed with zero diagnostics; all 12 routes built; link verification and all 91 Playwright tests passed at both `/` and `/portfolio-test`. Full-page and lower-section captures were reviewed at all six listed widths. Tablet experience dates sit above their entries to accommodate the supplied descriptions; desktop retains the original date/text columns and stepped alignment. The root build was restored after subpath verification.

## Remaining content and media work

Deeper project case-study content and secondary media, dedicated-page design/copy, and real Playground content remain future work. UFU and CCL recognition years and exact PIC Jr./Hotel de Hilbert dates are not supplied. Advanced interactions and Open Graph artwork are separate later tasks. Supply the production origin and base before enabling deployment.
