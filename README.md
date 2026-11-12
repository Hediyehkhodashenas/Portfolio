# Hediyeh Khodashenas — Portfolio

Static site (HTML, CSS, JS). Dark theme. No build step.

## Publish on GitHub Pages
1. Push these files to the root of the repository's `main` branch.
2. **Settings → Pages → Build and deployment**: Source *Deploy from a branch*, Branch `main`, folder `/ (root)`.
3. The site appears at `https://<username>.github.io/<repo>/`.

All paths are relative, so it works there and straight from disk (`file://`). `.nojekyll` skips Jekyll processing.

## Editing
- Projects: `assets/js/projects.js` — one entry per project. Keep `summary` to one short line.
- Images: put files in `assets/work/<slug>/` and list them in that project's `media` array. Frames with `width <= 500` are shown inside a phone.
- Deep links: `index.html?project=<slug>` opens a project's showcase.
- Preview locally: open `index.html` in a browser.

## Showcase controls
Click a thumbnail or use ← → to change frames · hover a tall frame to scroll it · click the frame (or Expand) for full view · swipe on touch.
