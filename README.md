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

## Adding artifacts (ingest script)

Use the Node ingest script to append artifacts and copy assets into the repo. After running the script, **commit the changes** and deploy.

### Image example

```
node scripts/add_artifact.mjs \
  --type image \
  --title "Signal Residue Bed" \
  --tags hypnagnosis,sleep,signal \
  --date 2026-01-01 \
  --thumb /path/to/thumb.webp \
  --full /path/to/full.jpg
```

### Text example

```
node scripts/add_artifact.mjs \
  --type text \
  --title "Draft Transmission" \
  --tags hypnagnosis,poem,signal \
  --date 2026-01-02 \
  --body /path/to/body.md
```

### Video example

```
node scripts/add_artifact.mjs \
  --type video \
  --title "Crawlspace Witness" \
  --tags hypnagnosis,video,signal \
  --date 2026-01-03 \
  --youtubeId abc123 \
  --thumb /path/to/thumb.webp
```

### Dropping onto the default board

Add `--drop` to also append a node to `public/data/boards/default.json`. You can optionally pass `--x` and `--y` to control placement:

```
node scripts/add_artifact.mjs ... --drop --x 40 --y -80
```

## Next steps

- Add React Flow integration for the infinite canvas.
- Define artifact and board schemas (JSON) and load them into the UI.
- Add an evidence drawer view for full-res prints, full poems, and embedded video.
