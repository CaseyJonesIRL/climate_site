# The Sea Yields

A static site — no build step, no backend. Plain HTML/CSS/JS, served by GitHub Pages at **https://theseayields.com**.

## Structure

```
index.html              Entry sequence (Beat 1 tap-reveal, Beat 2 choice, Beat 3 fork)
academic-freedom.html   "Semper Paratus — Not Censored Classrooms"
climate-change.html     "Climate Change — Talk About It" (includes the Arctic sea ice chart)
letter-template.html    Letter template with a Copy button
button-order.html       How to get a button
assets/style.css        All shared styles, colors, components
assets/site.js          All interactions: reveal, choice, badge dots, ice chart, copy button
assets/favicon.svg      Browser tab icon
assets/images/          Button photos and og-image.jpg (the link-preview image)
assets/documents/       The Feb 14, 2025 DHS directive (PDF)
CNAME                   Custom domain for GitHub Pages — don't delete
.claude/launch.json     Local dev server config (for Claude Code's preview only)
```

Every page's `<head>` carries its own title, description, and link-preview (Open Graph) tags. If you change a page's headline or the share image, update those tags too.

## Preview locally

Any static file server works, e.g.:

```
python3 -m http.server 8743
```

then open `http://localhost:8743`.

## Publishing

Merging to `main` publishes. GitHub Pages rebuilds from the `main` branch root within a minute or two.

## Updating the sea ice chart each September

NSIDC announces the Arctic minimum in mid-to-late September. Add the new year to the `iceData` list in `assets/site.js`, using the minimum extent from NSIDC's announcement (or the "NH-Annual-5-Day-Extent" sheet of NSIDC's `Sea_Ice_Index_Min_Max_Rankings_G02135_v4.0.xlsx`), rounded to two decimals. The chart, its end-year label, and the default readout all update from that list. Also point the "2026 minimum analysis" and NASA links in `climate-change.html` at the new year's pages.

## Analytics

Visitor counts come from [GoatCounter](https://www.goatcounter.com) (no cookies, no personal data). Dashboard: https://caseyjonesirl.goatcounter.com. Every page loads it with the one `<script data-goatcounter=...>` tag in its `<head>`; add the same tag to any new page.

Print `https://theseayields.com/?ref=qr` in the QR code and set the Namecheap `.org` redirect to `https://theseayields.com/?ref=org`, so the dashboard can separate those visitors.

## Custom domain

The site is live at **https://theseayields.com**. `theseayields.org` redirects to it.

- **`CNAME` file** at the repo root contains `theseayields.com`. Don't delete it: GitHub Pages reads it to know the custom domain. (Removing the domain in Settings → Pages deletes this file too.)
- **DNS (Namecheap → Advanced DNS)** for `theseayields.com`:
  - Four `A` records on `@` pointing at GitHub Pages: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
  - A `CNAME` record on `www` pointing at `caseyjonesirl.github.io.`
  - Nothing else on `@`. In particular, no `URL Redirect Record` — it adds Namecheap's redirect server (`162.255.119.207`) to the DNS answers and blocks the HTTPS certificate.
- **`theseayields.org`** uses Namecheap's **Redirect Domain** (Domain tab) for `theseayields.org` and `www.theseayields.org` → `https://theseayields.com`. Namecheap redirects can't serve HTTPS, so `https://theseayields.org` may show a certificate warning; plain `theseayields.org` works.
- **Email:** Namecheap email forwarding (MX records `eforward1–5.registrar-servers.com`) handles `buttons@theseayields.com`.
- **HTTPS:** GitHub issues and renews the certificate automatically. "Enforce HTTPS" is on in **Settings → Pages**. If it ever gets stuck greyed out, clear the custom domain and set it again to trigger a fresh certificate request.
