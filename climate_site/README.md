# Not Censored Classrooms

A static site — no build step, no backend. Plain HTML/CSS/JS, deployable straight to GitHub Pages.

## Structure

```
index.html              Entry sequence (Beat 1 tap-reveal, Beat 2 choice, Beat 3 fork)
academic-freedom.html   "Semper Paratus — Not Censored Classrooms"
climate-change.html     "Climate Change — Talk About It"
assets/style.css        All shared styles, colors, components
assets/gate.js          Password gate (see below)
assets/site.js          Tap-to-reveal / choice interactions
.claude/launch.json     Local dev server config (for Claude Code's preview only)
```

## Preview locally

Any static file server works, e.g.:

```
python3 -m http.server 8743
```

then open `http://localhost:8743`.

## The password gate

`assets/gate.js` has one line to change:

```js
var PASSWORD = "76ers1976";
```

**This is not real security.** The repo has to be public for free GitHub Pages hosting, so anyone who reads the source can see the password in plain text. It only stops casual visitors and search engines from landing on the site before you're ready — not a determined or technical visitor. Change the password before sending the link to reviewers, and again before wider review if you're worried about it leaking. Once the site is meant to be fully public, delete the `<script src="assets/gate.js">` line from all three HTML files (or just leave the password gate off going forward — it's harmless to leave in place, but pointless once launched).

If you want something that's *actually* secure instead (a real login wall, no password visible in the repo), the better free option is Cloudflare Access — point the domain's DNS through Cloudflare and put their Zero Trust login in front of the whole site. More setup, but properly secure. Ask if you want that built instead.

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

## Adding your custom domain

Once you've bought the domain (see prior discussion — `.org` recommended, e.g. `notcensoredclassrooms.org`):

1. Add a file named `CNAME` (no extension) at the repo root, containing just your domain name, e.g.:
   ```
   notcensoredclassrooms.org
   ```
2. At your registrar (or Cloudflare, if you route DNS through them), add:
   - An `A` record for the root domain pointing at GitHub Pages' IPs: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - A `CNAME` record for `www` pointing at `<your-username>.github.io`
3. Back in **Settings → Pages**, enter the custom domain and enable "Enforce HTTPS" once it's verified (can take a few minutes to a few hours after DNS propagates).

## Known placeholders — real destinations still needed before launch

These currently link to `#` and need real content or a real URL before this goes public:

- **"Read the directive →"** (`academic-freedom.html`) — needs a hosted copy of the actual Feb 14, 2025 DHS directive PDF.
- **"Read a letter template →"** — needs the actual template letter content (a page or a downloadable doc).
- **"Read a longer example letter →"** — needs the longer example letter content.
- **"Wear a button — order and info →"** — needs wherever button ordering actually happens (a form, an email link, whatever's real).

Everything else — NASA, NOAA, IPCC, AGU, AMS, the *Science* and *JGR* papers, the tide-gauge data — links to verified real sources already.
