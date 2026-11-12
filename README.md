# Hediyeh Khodashenas — Portfolio

Static site (HTML, CSS, JS). No build step.

## Publish on GitHub Pages
1. Push these files to the root of a public repository's `main` branch.
2. Repository **Settings → Pages → Build and deployment**: Source *Deploy from a branch*, Branch `main`, folder `/ (root)`.
3. The site appears at `https://<username>.github.io/<repo>/` (or `https://<username>.github.io/` if the repo is named `<username>.github.io`).

All paths are relative, so it works at either address. `.nojekyll` skips Jekyll processing.

## Editing
- Projects: `assets/js/projects.js` (one entry per project).
- Images: put files in `assets/work/<slug>/` and list them in that project's `media` array (see the comment at the top of `projects.js`). Images only appear once added.
- Preview locally: open `index.html` in a browser.
