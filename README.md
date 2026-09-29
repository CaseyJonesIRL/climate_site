# The Sea Yields

A static site — no build step, no backend. Plain HTML/CSS/JS, deployable straight to GitHub Pages.

## Structure

```
index.html              Entry sequence (Beat 1 tap-reveal, Beat 2 choice, Beat 3 fork)
academic-freedom.html   "Semper Paratus — Not Censored Classrooms"
climate-change.html     "Climate Change — Talk About It"
assets/style.css        All shared styles, colors, components
assets/site.js          Tap-to-reveal / choice interactions
.claude/launch.json     Local dev server config (for Claude Code's preview only)
```

## Preview locally

Any static file server works, e.g.:

```
python3 -m http.server 8743
```

then open `http://localhost:8743`.

## Deploying to GitHub Pages

1. Create a new repo on GitHub (public — required for free Pages hosting).
2. From this folder:
   ```
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git branch -M main
   git push -u origin main
   ```
3. In the repo's **Settings → Pages**, set the source to the `main` branch, root folder.
4. GitHub will publish it at `https://<your-username>.github.io/<repo-name>/`.

## Custom domain

The site is live at **https://theseayields.com**. `theseayields.org` redirects to it.

- **`CNAME` file** at the repo root contains `theseayields.com`. Don't delete it: GitHub Pages reads it to know the custom domain. (Removing the domain in Settings → Pages deletes this file too.)
- **DNS (Namecheap → Advanced DNS)** for `theseayields.com`:
  - Four `A` records on `@` pointing at GitHub Pages: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  - A `CNAME` record on `www` pointing at `caseyjonesirl.github.io.`
  - Nothing else on `@`. In particular, no `URL Redirect Record` — it adds Namecheap's redirect server (`162.255.119.207`) to the DNS answers and blocks the HTTPS certificate.
- **`theseayields.org`** uses Namecheap's **Redirect Domain** (Domain tab) for `theseayields.org` and `www.theseayields.org` → `https://theseayields.com`. Namecheap redirects can't serve HTTPS, so `https://theseayields.org` may show a certificate warning; plain `theseayields.org` works.
- **HTTPS:** GitHub issues and renews the certificate automatically. "Enforce HTTPS" is on in **Settings → Pages**. If it ever gets stuck greyed out, clear the custom domain and set it again to trigger a fresh certificate request.

## Known placeholders — real destinations still needed before launch

These currently link to `#` and need real content or a real URL before this goes public:

- **"Read the directive →"** (`academic-freedom.html`) — needs a hosted copy of the actual Feb 14, 2025 DHS directive PDF.
- **"Read a letter template →"** — needs the actual template letter content (a page or a downloadable doc).
- **"Read a longer example letter →"** — needs the longer example letter content.
- **"Wear a button — order and info →"** — needs wherever button ordering actually happens (a form, an email link, whatever's real).

Everything else — NASA, NOAA, IPCC, AGU, AMS, the *Science* and *JGR* papers, the tide-gauge data — links to verified real sources already.
