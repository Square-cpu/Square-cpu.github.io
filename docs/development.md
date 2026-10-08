# Development guide

Maintenance reference for the portfolio. The [root README](../README.md) is the public project introduction.

## Local setup

Use Node.js 22.12 or later; Node 24 is recommended and used by the deployment workflow. Install dependencies from the committed lockfile:

```sh
npm ci
npm run dev
```

The development server normally runs at `http://localhost:4321`. To inspect production output, run `npm run build` followed by `npm run preview`.

## Architecture

The site uses Astro 7, TypeScript, Content Collections, plain CSS, and component-local vanilla JavaScript. Pages are generated statically; navigation uses ordinary document links.

```text
src/
  content.config.ts        Project collection loader and validated schema
  content/projects/        Project frontmatter and Markdown bodies
  assets/projects/         Permanent project images and video poster
  data/                    Copy, interests, experiences, recognition, contacts
  lib/                     Base-aware routes and project selection
  components/
    common/                Shared labels, contact links, and icons
    home/                  Independent homepage sections
    navigation/            Sticky header and native dialog Index
    projects/              Previews, real media, and fallback studies
    interactive/           Replaceable visual and interaction boundaries
    experiments/           Space for future standalone experiments
  layouts/                 Shared document and flexible project layout
  pages/                   Static pages and dynamic project routes
  styles/                  Design tokens and global primitives
public/media/projects/     Permanent video assets
tests/                     Playwright regression checks
scripts/check-links.mjs     Built links, media, and anchor verification
.github/workflows/deploy.yml  GitHub Pages build and deployment
```

`BaseLayout` owns metadata, the skip link, header, main landmark, and shared contact footer. Individual pages should not duplicate that footer's contact group.

`ProjectLayout` supports the project body plus `media`, `experiments`, and `project-navigation` slots. Only the Markdown body is constrained by `.prose`; richer media and future custom components can use the surrounding layout. A future body requiring embedded components can use the official MDX integration, but it is not currently installed.

## Content editing

### Projects

Create a Markdown file in `src/content/projects/` with `title` and `summary`. The current `glob()` Content Layer loader derives the project ID from the filename; `/projects/[...slug]` generates its public route. Schema fields are defined in `src/content.config.ts`.

- `featured: true` and `featuredOrder` select and order homepage entries.
- `draft: true` excludes an entry from the homepage, archive, and generated project routes.
- Year, role, context, result, categories, technologies, and links describe project facts. Leave unknown optional values absent.
- `cover.src` references a local image relative to the Markdown file; `cover.alt` supplies its description.
- The archive sorts known years descending, then titles, with unknown years last.

Homepage composition belongs in `src/data/featured-presentation.ts` and preview components rather than project frontmatter. `ProjectPreview` exposes a shared semantic foundation and media slot. `ProjectMedia` renders real media; `ProjectStudy` remains a fallback for future entries without a cover.

Detailed case studies are still being documented. Keep the deliberate coming-soon message until verified long-form content is available.

### Other content

- `src/data/opening.ts`: shared Hero and About copy.
- `src/data/exploring.ts`: disclosure topics, descriptions, optional links, and optional last-updated dates.
- `src/data/experiences.ts`: reusable summaries, periods, highlights, and featured ordering.
- `src/data/recognition.ts`: grouped results with optional year, period, level, project, and detail; featured summaries serve the homepage.
- `src/data/site.ts`: site metadata, navigation, and public contact destinations.

Keep missing dates absent and preserve qualifications attached to rankings and results. Selective academic experiences belong in Experiences rather than being presented as medals. Playground is independent of the formal project collection; its temporary homepage studies are not finished project entries.

### Media

Production images live in `src/assets/projects/`; public video files live in `public/media/projects/`. `artifacts/` is ignored staging and review output, never a runtime asset source. The [media reference](project-media.md) records source mappings, the video crop, and integration details.

Use Astro's image pipeline for responsive output and intrinsic dimensions. Do not upscale sources. Preserve diagram and interface content when choosing crops, and provide meaningful alt text for informative images. Decorative visuals should not create screen-reader noise or focus stops.

The Motion Lab preview loads its silent video when visible, exposes a Play/Pause control, and pauses when it leaves the viewport or the tab is hidden. Reduced motion uses the real poster without automatic playback or video download; manual playback does not loop. Without JavaScript, the poster remains available.

## Styling and interaction

`src/styles/tokens.css` centralizes colors, type, spacing, widths, geometry, motion, and layers. `global.css` owns shared primitives and self-hosted Instrument Sans and IBM Plex Mono imports. Replace imports and font tokens together when changing typography.

`.shell` caps content at 1472px with responsive gutters. `.layout-grid` provides four mobile columns and twelve at 768px and above; components choose their own spans. Keep layout-specific decisions local and use shared tokens for recurring values.

The sticky header opens a native modal dialog. Opening locks background scrolling; Escape and the close button dismiss it and restore focus. Without JavaScript, INDEX links to footer navigation. Currently Exploring uses native `details`/`summary`, keeping topics readable while collapsed.

Preserve semantic headings, landmarks, visible focus, decorative SVG semantics, and reduced-motion support. Hide redundant arrows from assistive technology. Keep runtime code isolated to the interaction that needs it.

## Verification

Install Playwright's browser once, then run checks against a fresh production build:

```sh
npx playwright install chromium
npm run check
npm run build
npm run verify:links
npm test
```

`check` validates Astro and TypeScript. The build validates collection schemas and generates routes. `verify:links` checks built local links, media, and anchors. Playwright covers route behavior, supplied content, keyboard navigation, focus, native disclosure, reduced motion, media loading, and responsive layouts.

Tests start their own production preview. If port 4321 is occupied, set `PLAYWRIGHT_PORT`. An installed Edge or Chrome can be selected with `PLAYWRIGHT_CHANNEL`:

```powershell
$env:PLAYWRIGHT_CHANNEL = 'msedge'
$env:PLAYWRIGHT_PORT = '4323'
npm test
```

Screenshots and test output are saved under ignored `artifacts/` directories. Review visual captures when changing layout or integrating content; automated checks alone do not assess composition.

## Routing and metadata

`astro.config.mjs` defaults to `SITE_URL=https://square-cpu.github.io` and `BASE_PATH=/`. Shell environment variables can override those values; this config does not automatically read `.env` files. The site URL supplies canonical and Open Graph URLs.

Use `withBase()` from `src/lib/paths.ts` for internal links and public assets. Imported Astro image URLs are handled by Astro. `sectionCurrent()` matches whole path segments, so nested project pages activate Projects without confusing similar prefixes.

To regression-test a repository subpath locally:

```powershell
$env:SITE_URL = 'https://square-cpu.github.io'
$env:BASE_PATH = '/portfolio-test'
npm run build
npm run verify:links
npm test
Remove-Item Env:BASE_PATH
Remove-Item Env:SITE_URL
npm run build
```

The final build restores the intended root configuration. `/portfolio-test` is only a test base, not the production deployment path.

## GitHub Pages deployment

The intended user-site repository is **Square-cpu/Square-cpu.github.io**, served at **https://square-cpu.github.io/**. There is no repository subpath or custom domain.

1. Create the public repository `Square-cpu.github.io` under `Square-cpu`, with `main` as its default branch. Leave GitHub's README, license, and `.gitignore` initialization unchecked when pushing existing local history. If the repository already exists, inspect its history before proceeding.
2. In **Settings → Secrets and variables → Actions → Variables**, add repository variables:
   - `SITE_URL`: `https://square-cpu.github.io`
   - `BASE_PATH`: `/`
3. Set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**, and ensure Actions are enabled.
4. Review and commit the intended source changes. Keep `package-lock.json` and production assets tracked; exclude dependencies, build output, staging media, screenshots, `.env` files, and local notes. Inspect `git status --short` and `git diff --cached --stat` before committing.
5. Preserve the existing `origin` remote if needed by adding a separate remote for publication:

   ```powershell
   git remote -v
   git remote add pages https://github.com/Square-cpu/Square-cpu.github.io.git
   git push -u pages main
   ```

   If `pages` already exists, verify its destination rather than adding it again. These commands publish the repository and should be run only when ready.
6. In **Actions**, inspect **Deploy to GitHub Pages**. The Node 24 build runs Astro/TypeScript checks, production build, link verification, Chromium installation, and Playwright tests before uploading the Pages artifact. Guards require the intended repository, origin, and root base. The deployment job runs only after the build succeeds.
7. After both jobs succeed, inspect the public site: Index navigation, dedicated pages, project covers and video, social links, and canonical URLs. The deployed URL also appears in the `github-pages` environment and Pages settings.

The workflow uses `actions/checkout@v7`, `withastro/action@v6`, and `actions/deploy-pages@v5`; `docs/deploy.yml.example` is its reference copy. Future commits pushed to `main` with `git push pages main` deploy automatically. A manual rerun is available through `workflow_dispatch`.

Official references: [Content Collections](https://docs.astro.build/en/guides/content-collections/), [images](https://docs.astro.build/en/guides/images/), and [GitHub Pages deployment](https://docs.astro.build/en/guides/deploy/github/).
