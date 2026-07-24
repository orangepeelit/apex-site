# apex-site

Public microsite for **APEX**, hosted at:

`https://apex.orangepeeluk.co.uk`

## Conceptual structure

- **OPUS** — the methodology.
- **OPUS research programme** — develops, tests and challenges the methodology.
- **APEX** — the practical implementation environment and public microsite.
- **Applications** — specific uses built over shared organisational knowledge.

## Version

Current release: **v0.5**

## Pages

- `index.html` — Home
- `opus.html` — OPUS methodology
- `research.html` — Research programme
- `papers.html` — Papers and intended publication sequence
- `applications.html` — Potential APEX applications
- `roadmap.html` — Directional roadmap
- `about.html` — Origin and Orange Peel context
- `contact.html` — Contact
- `styles.css` — Shared visual design and responsive behaviour
- `script.js` — Reveal-on-scroll behaviour
- `CHANGELOG.md` — Release history

## Local preview

Open `index.html` directly in a browser or run a local web server from the repository directory.

For example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deployment

Commit the files to the `apex-site` GitHub repository and push to the branch used by the hosting service.
