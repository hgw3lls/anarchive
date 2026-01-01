# Anarchive

Anarchive is a Vite + React static site scaffold for an infinite “crazy wall” archive (riso prints, poetry, text artifacts, and video thumbnails).

## Development

- `npm install`
- `npm run dev`

## Build

- `npm run build`
- `npm run preview`

## Hosting

This project is designed to deploy as static files (the `dist/` folder) to:

- **GitHub Pages**
- **DreamHost** (or any static web host)

### Vite base path

`vite.config.js` is currently set to `base: "/"` for **root** deployment (works for a user/org Pages repo like `username.github.io` or for a custom domain).

If you end up serving the site from a subpath like `/anarchive/`, change `base` to `"/anarchive/"`.

## Next steps

- Add React Flow integration for the infinite canvas.
- Define artifact and board schemas (JSON) and load them into the UI.
- Add an evidence drawer view for full-res prints, full poems, and embedded video.
