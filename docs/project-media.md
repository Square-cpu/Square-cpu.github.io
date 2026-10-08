# Project media — Phase 3A/3B

The source directory is `artifacts/phase-3_images/`. It is staging only: production components never import or reference it. All source files are preserved unchanged. Image copies use durable names under `src/assets/projects/`; only the primary cover for each project is rendered on the homepage. Secondary images are ready for future case studies and are not shipped merely because they exist in this directory.

## Image mapping

All source names below are relative to `artifacts/phase-3_images/`. Production paths are relative to the project root. Copies are byte-identical PNGs; Astro creates optimized outputs separately during builds.

| Source file | Production asset | Use |
| --- | --- | --- |
| Nature generator with Driven Wave Function Collapse (Driven WFC).png | `src/assets/projects/wfc/cover.png` | WFC homepage cover |
| Pasture Intelligence System_ UN x TKS consulting challenge.png | `src/assets/projects/pasture-intelligence/movement-model.png` | Pasture Intelligence homepage cover |
| ENEM Startup 1.png | `src/assets/projects/enem/dashboard.png` | ENEM homepage cover |
| ENEM Startup 2.png | `src/assets/projects/enem/mock-exams.png` | ENEM future case study |
| ENEM Startup 3.png | `src/assets/projects/enem/study-setup.png` | ENEM future case study |
| Asteroid Watchers 1.png | `src/assets/projects/asteroid-watchers/cover.png` | Asteroid Watchers homepage cover |
| Asteroid Watchers 2.png | `src/assets/projects/asteroid-watchers/asteroid-data.png` | Asteroid Watchers future case study |
| Asteroid Watchers 3.png | `src/assets/projects/asteroid-watchers/impact-simulation.png` | Asteroid Watchers future case study |
| Hackathon Ifood 1.png | `src/assets/projects/ifood/overview.png` | iFood future case study |
| Hackathon Ifood 2.png | `src/assets/projects/ifood/customer-profile.png` | iFood future case study |
| Hackathon Ifood 3.png | `src/assets/projects/ifood/recommendations.png` | iFood homepage cover |
| Hackathon Ifood 4.png | `src/assets/projects/ifood/menu.png` | iFood future case study |
| Hackathon Ifood 5.png | `src/assets/projects/ifood/ranking.png` | iFood future case study |
| Hackathon Ifood 6.png | `src/assets/projects/ifood/management.png` | iFood future case study |

## Motion Lab

`Testing Motion Lab 2.mp4` was selected after inspecting both recordings and multiple frames. Its workspace can be cropped cleanly without changing content. Video 1 stays in staging and is unused.

| Source | Production asset | Use |
| --- | --- | --- |
| Testing Motion Lab 2.mp4 | `public/media/projects/motion-lab/preview.mp4` | Motion Lab homepage preview |
| Frame at 2 seconds of the cropped preview | `src/assets/projects/motion-lab/poster.png` | Stable real poster and existing project-page cover |

The original recording is 1280×720, about 529 KiB, and contains audio. The derivative crops the main animation workspace to 826×608 at x=220, y=98, removes audio, and retains the full 23.27-second recording at 30 fps. It is H.264 with `yuv420p` and fast-start metadata, about 271 KiB. The crop excludes surrounding page/browser areas; no interface or animation output is fabricated. Local ffmpeg was already available, so no dependency was installed.

Recreate the derivative from the untouched source:

```powershell
ffmpeg -hide_banner -loglevel error -i 'artifacts/phase-3_images/Testing Motion Lab 2.mp4' -vf 'crop=826:608:220:98' -an -c:v libx264 -crf 24 -preset medium -pix_fmt yuv420p -movflags +faststart public/media/projects/motion-lab/preview.mp4
ffmpeg -hide_banner -loglevel error -ss 2 -i public/media/projects/motion-lab/preview.mp4 -frames:v 1 src/assets/projects/motion-lab/poster.png
```

The collection stores a base-relative `previewVideo.src`; `withBase()` resolves it. The source is attached only when playback is requested, with `preload="none"`. Visibility starts muted inline looping playback unless reduced motion is requested or the visitor paused it. Playback pauses outside the viewport and while the document is hidden. A real Play/Pause button supports keyboard access and lets visitors stop prolonged motion. Reduced motion and no JavaScript retain the poster without automatic playback; manual reduced-motion playback does not loop.

## Integration

`cover.src` and required `cover.alt` are validated through the existing Content Layer schema. `previewVideo` is optional and validates its MP4 path and dimensions. Content stays independent of the homepage's presentation variants.

`ProjectMedia.astro` uses Astro's responsive image pipeline with WebP quality 90, intrinsic dimensions, lazy loading, and output widths no larger than the source. WFC fills its established feature area. Research plots, interface screenshots, and the video use `contain` with media-specific proportions. Five informative still previews have real alt text; the decorative video/poster layer is hidden from assistive technology, while its playback button remains accessible.

`ProjectStudy` remains the fallback for a future project without real media. The six current selected projects all render real media and supplied summaries. Secondary assets do not create a slideshow or gallery. Individual project pages retain their existing basic cover behavior and unfinished case-study bodies.

Review screenshots, source integrity records, and media-size observations live in the ignored `artifacts/phase-3ab/` directory. They are review artifacts, not runtime assets.

## Verification observations

All 16 staging files matched their original SHA-256 hashes after integration. At 1440px with device scale factor 1, the browser selected six preview images/posters totaling 171,646 bytes (about 168 KiB). At 390px with device scale factor 2, they totaled 209,742 bytes (about 205 KiB). These totals represent the selected preview images after scrolling, not the entire homepage or every generated responsive variant. Individual selected outputs ranged from roughly 13 to 59 KiB. The 277,462-byte video was not requested on the initial viewport; it loaded when the preview became visible with ordinary motion preferences. Reduced motion retained the poster without fetching the video.

Astro/TypeScript, all 12 production routes, and link/media verification passed. All 81 Playwright tests passed at both `/` and `/portfolio-test`; full-page media captures were reviewed at 320/360/390/430/768/1024/1280/1440/1920px. The build was restored to the root base after subpath verification. The active-video capture is `artifacts/phase-3ab/motion-lab-playing-1440.png`; stable posters and all requested full-page/section captures are in the same directory.
