# Arthur Milander — portfolio foundation

Phase 2A: the Phase 1 static Astro 7 foundation with a global visual system and editorial Header/Index. TypeScript, plain CSS, six placeholder project entries, and isolated vanilla-JavaScript navigation remain intact. Homepage sections are still structural placeholders. No UI framework, animation library, or backend.

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

Year and role are optional because neither has been supplied. Technologies, categories, links, and status stay empty/unset rather than implying facts. Dates and roles visibly say “To be added.” All six entries intentionally publish as clearly marked placeholders; `draft: true` removes an entry from all generated routes and lists.

Add a project by creating a Markdown file with `title` and `summary`. Add `featured: true` and `featuredOrder` for homepage inclusion. Optional fields are documented directly in the schema. `cover.src` resolves a local image relative to the content file and requires descriptive `cover.alt`. Render real images through Astro's `Image` component with meaningful alt text; mark truly decorative images explicitly in their own components.

Visual variants belong in components or a separate presentation map keyed by project ID, rather than adding layout instructions to content. `ProjectPreview` has a typed project/context interface and an optional media slot. Replace it, or select different preview components in Selected Work, without rewriting project files.

`ProjectLayout` accepts normal Astro content plus `media`, `experiments`, and `project-navigation` slots. Only the current Markdown body is inside `.prose`; rich media can use the full content width. For case studies needing components inside their body, add the official `@astrojs/mdx` integration and extend the loader to `**/*.{md,mdx}`. Alternatively compose an Astro component in the dynamic route using the existing slots. No island framework is required until a particular interaction warrants one. Keep scripts local to the owning component and clean up long-lived listeners if client-side routing is ever introduced.

Playground is intentionally independent of the project schema. Experiences, Awards, and About remain simple page structures until real content reveals which fields are useful. Shared contact links live in `src/data/site.ts`; no fake contact addresses are included.

## Interaction and accessibility

The Index uses `dialog.showModal()` for native focus containment, background inertness, and Escape dismissal. Opening locks page scrolling; closing restores focus to INDEX. Normal links perform full document navigation. Without JavaScript, INDEX links to a footer navigation list. Exploring uses native `details`/`summary`, keeping topics visible while collapsed. Only its indicator and the dialog entrance have restrained motion; global reduced-motion rules disable both.

Tokens centralize color, spacing, type, widths, borders, radii, motion, and layers. A skip link, visible focus, semantic landmarks, and responsive layouts are shared across pages.

## Phase 2A visual system

`src/styles/tokens.css` owns the provisional theme. Background/surfaces use `#11110f`, `#171714`, and `#1d1d19`; text is `#f0eee8`, readable muted text `#9f9c94`, and decorative faint detail `#6f6d67`. Borders use `#2d2c28` / `#46443e`. The warm `#e1c98f` keyboard outline stays clearly visible. Faint and border colors must not be used for essential text.

Two font dependencies are self-hosted through CSS imports in `global.css`: `@fontsource-variable/instrument-sans` (normal variable weight 400–700) and `@fontsource/ibm-plex-mono` (Latin, normal 400 only). No external font service is contacted. Replace those imports and the `--font-body` / `--font-mono` tokens to change families. [Fontsource's installation documentation](https://fontsource.org/docs/getting-started/install) describes the package approach. System fallbacks and `font-display: swap` keep content available during loading.

Typography scales with `clamp()`: body 17–19px, metadata 12–14px, section headings 32–72px, page/display titles 44–120px, Index titles 30–72px. Navigation uses sans-serif; numbering and labels use mono. Geometry tokens are 2/4/7px, with only a tiny radius applied to controls.

`.shell` caps content at 1472px and uses gutters `clamp(16px, 4vw, 64px)`. `.layout-grid` supplies four mobile columns and twelve at 768px+, with local components choosing their own spans. The 96–160px `--space-section` token is available for future compositions; existing placeholder sections retain their modest spacing. `--space-page`, `--space-content`, and `--space-ui` cover other rhythms. `SectionLabel.astro` supports optional numbering and a ruled variant without prescribing a whole section layout.

The 72px sticky header uses an opaque background and thin rule, without scroll JavaScript or blur. The full name fits at 320px. The native fullscreen Index has large ruled rows, a small dot and stronger text/rule for the current section, and a 4px text shift on hover/focus. Entrance motion lasts 560ms; closing is immediate so native Escape/focus behavior is not delayed. Feedback tokens are 140/280/560ms; reduced motion removes transitions and animation. Short screens scroll naturally inside the dialog.

`sectionCurrent()` in `src/lib/paths.ts` strips the configured base by whole path segments and matches section boundaries. Exact routes use `aria-current="page"`; descendants use `aria-current="true"`. Home matches only the local root. Similar prefixes such as `projects-other` never activate Projects.

Links retain underlines and clear keyboard outlines. Existing continuation/back arrows remain; use `→` for continuation, `↗` for future external links, `↓` for disclosure, and `←` for return where helpful. Decorative symbols should be hidden from assistive technology when the link text already explains the action.

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

## Remaining Phase 2 work

- Phase 2B — Hero, About, and Currently Exploring.
- Phase 2C — Selected Work.
- Phase 2D — Experience, Playground, Recognition, and Footer.
- Phase 2E — Responsive and visual polish.

Final copy, verified project/experience/award facts, media, contact details, and advanced interactions remain future work. Supply the production origin and base before enabling deployment. Open Graph artwork remains to be designed.
