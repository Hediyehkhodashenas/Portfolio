# Hediyeh Khodashenas — Portfolio

Static site (HTML, CSS, JS). Dark theme. No build step.

The home page is a **canvas** you can pan and zoom. Each project is a colourful **sticky note** (name + short tag). Next to them are clearly titled zones: About me, Experience, Education, Recognition, Contact. The first view frames all of them, and the section chips in the top bar fly the camera to each one. Clicking a project note zooms into it and opens that project's own **project canvas**, a second pannable space with a title note, a **Web** row of desktop frames and a **Mobile** row of phone frames. Projects without images show an honest "Designs coming soon" placeholder. A **List** view (top right) shows the same content as a plain page.

## Publish on GitHub Pages
1. Push these files to the root of the repository's `main` branch.
2. **Settings → Pages → Build and deployment**: Source *Deploy from a branch*, Branch `main`, folder `/ (root)`.
3. The site appears at `https://<username>.github.io/<repo>/`.

All paths are relative, so it works there and straight from disk (`file://`). `.nojekyll` skips Jekyll processing. `404.html` is the not-found page.

## Structure
- `index.html`: top bar (with section chips), home canvas (title area and info notes are plain HTML), list view, project canvas overlay, case-study sheet, lightbox, `<noscript>` fallback.
- `assets/js/projects.js`: project data (one entry per project).
- `assets/js/camera.js`: pan/zoom engine (one CSS transform, pointer events, momentum, soft bounds). Used by both the home canvas and the project canvas.
- `assets/js/main.js`: builds the sticky notes, the home layout (wide and phone), the section nav, the project canvas, the case-study sheet, routing, keyboard and the list view.
- `assets/css/style.css`: base styles, case study, lightbox.
- `assets/css/canvas.css`: top bar, chips, canvas, sticky notes, zone titles, HUD, project canvas, case-study sheet, list view.

## Editing
- Projects: `assets/js/projects.js`. `context` is the short tag on the sticky note (falls back to the category). `category` sets the group on the home canvas (`digital`, `visual`, `engineering`). Note colours cycle through yellow, pink, mint, lavender, peach and sky in display order, and each note gets a small fixed tilt.
- Images: put files in `assets/work/<slug>/` and list them in that project's `media` array. Frames with `width <= 500` go in the Mobile row, all others in the Web row. A project with no media shows the "Designs coming soon" placeholder. For bigger sets (see Speaksynq), give each media item a `group` (section title, e.g. "Web"), a `row` (flow title) and optionally `kind` ("board" or "component"). Frames then appear in labelled rows, in order, with arrows between steps, and the top bar gets section chips.
- Home layout: `layoutHome()` in `main.js` (separate wide and phone layouts). Units are canvas px at 100% zoom.
- Info notes: edit their text in `index.html` (`<aside class="note">`). The list view reuses the same text.
- Case study: a project can carry an optional `caseStudy` object. It opens from the project canvas (the "Case study" button or card). `index.html?project=action-sports-club#case-study` lands on it directly. Images live in `assets/work/<slug>/case-study/`.
- Preview locally: open `index.html` in a browser.

## Links
- `index.html?project=<slug>` opens a project canvas directly. Back, Esc or the browser's back button return home, to the camera position you left.
- `index.html?project=<slug>#case-study` opens the case study.
- `index.html#list` opens the list view.

## Controls
Drag to pan (mouse or touch) · two-finger trackpad scroll pans · pinch or ctrl/⌘ + scroll zooms · double-click empty canvas to zoom in · arrow keys / WASD pan · `+` / `−` zoom · `0` fit all · `1` 100% · Tab moves through notes and frames, Enter opens · Esc steps back one level (lightbox → case study → project canvas → home). On the project canvas, clicking a frame fits it to the screen, and clicking it again opens it full size. `prefers-reduced-motion` turns camera moves into instant cuts.
