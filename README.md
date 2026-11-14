# Hediyeh Khodashenas — Portfolio

Static site (HTML, CSS, JS). Dark theme. No build step.

The home page is a **design canvas**: pan around a dark, dotted file where each project is an artboard, with a few sticky notes (about, experience, education, recognition, contact). Clicking a frame zooms into it and opens the full project view. A **List** view (top right) shows the same projects as a plain vertical list.

## Publish on GitHub Pages
1. Push these files to the root of the repository's `main` branch.
2. **Settings → Pages → Build and deployment**: Source *Deploy from a branch*, Branch `main`, folder `/ (root)`.
3. The site appears at `https://<username>.github.io/<repo>/`.

All paths are relative, so it works there and straight from disk (`file://`). `.nojekyll` skips Jekyll processing. `404.html` is the not-found page.

## Structure
- `index.html` — top bar, canvas (title area + sticky notes are plain HTML), list view, project view, lightbox, `<noscript>` fallback.
- `assets/js/projects.js` — project data (one entry per project).
- `assets/js/camera.js` — pan / zoom engine for the canvas (one CSS transform, pointer events, momentum, soft bounds).
- `assets/js/main.js` — builds the artboards and the list from `projects.js`, places everything on the canvas, HUD, routing, project showcase and case study.
- `assets/css/style.css` — base styles, project showcase, case study, lightbox.
- `assets/css/canvas.css` — canvas, artboards, sticky notes, HUD, top bar, list view, project-view overlay.

## Editing
- Projects: `assets/js/projects.js`. Keep `summary` to one short line. `category` decides the cluster on the canvas (`digital`, `visual`, `engineering`).
- Images: put files in `assets/work/<slug>/` and list them in that project's `media` array. Frames with `width <= 500` are shown inside a phone. The first desktop image becomes the artboard preview; projects without images get a typographic artboard (context, year, title, scope).
- Canvas layout: positions are in `PLACE` (clusters) and `NOTES` (sticky notes) near the top of the canvas section in `main.js`. Units are canvas px at 100% zoom. The first digital project with images gets the wide cover + mobile frame.
- Sticky notes: edit their text in `index.html` (`<aside class="note">`). The list view reuses the same text.
- Case study: a project can carry an optional `caseStudy` object. It renders below that project's showcase. `index.html?project=action-sports-club#case-study` lands on it directly. Images live in `assets/work/<slug>/case-study/`.
- Preview locally: open `index.html` in a browser.

## Links
- `index.html?project=<slug>` opens a project directly; Back / Esc zooms out to the canvas.
- `index.html#list` opens the list view.

## Canvas controls
Drag to pan (mouse or touch) · two-finger trackpad scroll pans · pinch or ctrl/⌘ + scroll zooms · double-click empty canvas to zoom in · arrow keys / WASD pan · `+` / `−` zoom · `0` fit all · `1` 100% · Tab moves through artboards, Enter opens · Esc steps back one level (lightbox → project → canvas). Click a sticky note to bring it up to reading size. The HUD (bottom) has zoom, Fit all, and a Sections jump list. `prefers-reduced-motion` turns camera moves into instant cuts.

## Showcase controls
Click a thumbnail or use ← → to change frames · hover a tall frame to scroll it · click the frame (or Expand) for full view · swipe on touch.
