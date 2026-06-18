# The Playbook RE — Site Documentation

**Live site (custom domain):** https://theplaybookre.com — ✅ **live** (attached to Netlify 2026-06-18, HTTPS via Let's Encrypt). GoDaddy DNS: apex `A → 75.2.60.5`, `www CNAME → the-playbook-re.netlify.app`. Also reachable at `the-playbook-re.netlify.app`.
**GitHub repo:** git@github.com:christto223/theplaybookre-site.git
**Hosting:** Netlify (auto-deploys from `main` branch)
**Built with:** Astro **6.4.2**, static output, no SSR adapter

> **Last comprehensive update:** 2026-06-06. See the [Change Log](#change-log) at the bottom for what changed and why.

---

## Running the Dev Server

### Reliable command (use this if `npm` isn't found)
```bash
/opt/homebrew/Cellar/node/26.0.0/bin/node \
  "/Users/christopherlinsellmba/Desktop/Claude Code/theplaybookre-site/node_modules/astro/bin/astro.mjs" dev
```

### If `npm` is working normally
```bash
cd "/Users/christopherlinsellmba/Desktop/Claude Code/theplaybookre-site"
npm run dev
```

Server runs on **http://localhost:4321** (or 4322 if taken). First boot after clearing caches can take ~50s (content sync + cold compile); subsequent reloads are fast.

### Critical: local Node version must be 26
- **Node 26.0.0** — works correctly (local dev)
- **Node 22.x** — local dev server hangs with no output (Netlify *builds* on 22 fine — see below)
- **Node 25.x** — broken system library (`libsimdjson` missing after a Homebrew update)

```bash
/opt/homebrew/bin/node --version          # should say v26.0.0
brew unlink node@22 && brew link node     # switch back to Node 26 if needed
```

> Note the split: **local dev needs Node 26**, but **Netlify builds on Node 22** (set in `netlify.toml`) and that works — the hang is a local dev-server-startup issue on this machine, not a build incompatibility.

### If the dev server hangs or modules look broken — clean reinstall
A corrupted `node_modules` will make the server hang silently or throw `ERR_MODULE_NOT_FOUND`. The fix is a full clean reinstall (deletes the lockfile so npm resolves fresh from `package.json`):
```bash
cd "/Users/christopherlinsellmba/Desktop/Claude Code/theplaybookre-site"
rm -rf node_modules package-lock.json .astro node_modules/.vite
npm install
```
> A plain `npm install` against a bad lockfile is *not* enough — delete `package-lock.json` too.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Astro **6.4.2** (static output) |
| Hosting | Netlify |
| Adapter | None — static HTML deploys fine without one |
| Sitemap | `@astrojs/sitemap` |
| Markdown directives | `remark-directive` + custom `src/plugins/remark-playbook-blocks.mjs` |
| Email list | Beehiiv (via Netlify Function) |
| Form intake | Netlify Forms (pitch + resource suggestions) |
| Fonts | Bebas Neue, Inter, DM Sans (Google Fonts) |
| Styles | Scoped CSS in `.astro` files + `src/styles/global.css` |

> **`astro` is pinned to `6.4.2`** in `package.json` for reproducible builds. `@astrojs/sitemap` and `remark-directive` remain on ranges. The unused `@astrojs/netlify` adapter has been **removed** (it was never imported and caused dev-server hangs if it ever was).

---

## Project Structure

```
theplaybookre-site/
├── src/
│   ├── components/
│   │   ├── Masthead.astro          # Sticky header: search, nav, "Get the Newsletter" CTA
│   │   ├── Footer.astro            # Footer + newsletter modal + advertise modal
│   │   ├── NewsletterBand.astro    # "Build the Business" subscribe band (on 7 pages)
│   │   ├── PillarStrip.astro       # 8-pillar horizontal nav strip
│   │   ├── ArticleCard.astro       # Reusable article card
│   │   └── SEOHead.astro           # Meta tags, OG, JSON-LD schema
│   ├── layouts/
│   │   ├── BaseLayout.astro        # Universal page shell (Masthead + Footer)
│   │   └── ArticleLayout.astro     # Article detail page shell
│   ├── pages/
│   │   ├── index.astro             # Homepage
│   │   ├── [pillar]/
│   │   │   ├── index.astro         # Pillar archive (e.g. /lead-generation/)
│   │   │   └── [slug].astro        # Article detail page
│   │   ├── playbooks/index.astro   # All-articles archive
│   │   ├── toolkit/index.astro     # Free resources + "Suggest a Resource" form
│   │   ├── start-here.astro        # Start Here + "Start the Series" modal
│   │   ├── about.astro             # About page
│   │   ├── write-for-us.astro      # Writer pitch form (Netlify Forms)
│   │   ├── privacy.astro           # Privacy policy (needs attorney review)
│   │   ├── terms.astro             # Terms of use (needs attorney review)
│   │   └── search.json.ts          # Static search index, served at /search.json
│   ├── content/
│   │   ├── articles/{pillar}/      # Editorial content (markdown), one folder per pillar
│   │   └── toolkit/                # Downloadable resource definitions (markdown)
│   ├── content.config.ts           # Content collection schemas (articles, toolkit)
│   ├── data/
│   │   ├── pillars.ts              # The 8 content pillars (slug, name, shortName, description)
│   │   ├── mostRead.ts             # Manually curated Most Read article IDs
│   │   └── clPosts.ts              # ChrisLinsell.com crossover posts (static, placeholder URLs)
│   ├── plugins/
│   │   └── remark-playbook-blocks.mjs  # Renders :::callout / :::warning / :::phase at build time
│   └── styles/
│       └── global.css              # Brand tokens, fonts, article block styles
├── netlify/
│   └── functions/
│       └── newsletter-subscribe.js # Beehiiv API proxy (keeps API key server-side)
├── .claude/launch.json             # Local dev-preview launch config (tooling, not deployed)
├── astro.config.mjs                # Sitemap + remark plugins + trailingSlash: 'always'. NO adapter import.
├── netlify.toml                    # Netlify build config (Node 22)
└── .env                            # Local credentials (gitignored — never commit)
```

---

## Brand Tokens

Defined in `src/styles/global.css`:

```css
--yellow:   #FFD100
--black:    #111111
--white:    #FFFFFF
--off-white:#F7F7F2
--charcoal: #444444
--gray:     #888888
--rule:     #E0E0DA
```

**Typography:** Bebas Neue (headings/display), Inter (UI/labels), DM Sans (body copy)

---

## Content Collections

Schemas in `src/content.config.ts`.

### Articles
Path: `src/content/articles/{pillar}/{slug}.md`
```yaml
---
title: "Your Article Title"
description: "One sentence description for cards and SEO."
publishDate: 2025-05-01
pillar: lead-generation          # must match a slug in src/data/pillars.ts
tags: ["Cold Calling"]           # first tag displays on cards
readTime: 8                      # minutes
accentWord: "Zero"               # word highlighted yellow in title display
featured: false                  # true = Featured Hero on homepage
draft: false                     # true = excluded from all collections
heroImage: filename.jpg          # optional, place in public/images/
---
```

### Toolkit Resources
Path: `src/content/toolkit/{slug}.md`
```yaml
---
title: "Resource Title"
description: "Short description."
resourceType: template           # template | script | checklist | calculator | guide
pillar: lead-generation
order: 1                         # controls homepage display order
format: "Google Sheets + PDF"
includes:
  - "Item one"
  - "Item two"
---
```

> **Astro content API note:** content entries are keyed by **`entry.id`** (the slug), **not** `entry.slug` — `entry.slug` was removed in the Astro version we run. Use `entry.id` for routing/lookups. (A past bug used `.slug`, which rendered `undefined` and broke the toolkit modal buttons.)

---

## Article Content Blocks (`:::` directives)

Articles use a set of custom block components authored as markdown **directives**, transformed to styled HTML **at build time** by `src/plugins/remark-playbook-blocks.mjs` (via `remark-directive` in `astro.config.mjs`). Styles live in `src/styles/global.css`.

**📄 Full authoring reference** (for writing articles or driving a content skill): [`docs/article-content-elements.md`](docs/article-content-elements.md).

Available directives: `:::callout`, `:::warning`, `:::protip`, `:::takeaways`, `:::stat{value}`, `:::quote{cite}`, `:::verdict{title}`, `:::phase`, `:::proscons`, `:::checklist{title}`, `:::quickfacts`, `:::newsletter{heading}` — plus `✓`/`✗` auto color-coding inside markdown tables. Quick examples:

**Callout** — yellow left-border emphasis box:
```markdown
:::callout
**The lead-in (bold):** The rest of the callout body text.
:::
```

**Warning** — pale-yellow box with an automatic "⚠ WARNING" label:
```markdown
:::warning
The caution text goes here.
:::
```

**Phase** — numbered step sequence. Each `### Step N: Title` heading + the paragraph(s) after it becomes a numbered row (badge auto-numbered 1, 2, 3…):
```markdown
:::phase
### Step 1: Research the Property
Body for step one.

### Step 2: Pre-Appointment Call
Body for step two.
:::
```

> These are **build-time** transforms — no client JS. Don't reintroduce a browser-side transformer; earlier one assumed Astro rendered `:::` as `<blockquote>` (it doesn't), so it never worked.

---

## Content Creation & Publishing Workflow

Articles are **written in Claude Cowork** using the **`the-playbook-content`** skill, then **published here in Code** by the **`playbook-publishing-bot`** skill — the two halves of the pipeline.

**1. Write (Cowork — `the-playbook-content`).** Chris provides a primary keyword, secondary keyword, search intent, and angle. The skill archives the brief, runs Ahrefs + live-search research, returns a source-annotated outline for up to two approval rounds, drafts against Chris's voice guides and an SEO/GEO spec using the `:::` element toolkit, scores against rubrics, and delivers a finished markdown file (frontmatter + body) to the watch folder. The element catalog it writes to is documented in [`docs/article-content-elements.md`](docs/article-content-elements.md) (plain-text twin: `docs/article-content-elements.txt`).

**2. Publish (here — `playbook-publishing-bot`).** Given the finished markdown in the watch folder, the bot:
- Drops the file at `src/content/articles/{pillar}/{slug}.md` (body unchanged — editorial content is read-only).
- Routes the slug-named hero into `public/images/{slug}.jpg` and optimizes it (see below); reconciles the `heroImage` extension.
- Validates frontmatter, runs a real build, and verifies on the dev server: every `:::` directive renders styled (no literal `:::`), internal links resolve, and the hero shows on the article + cards.
- Commits + pushes to `main` (auto-deploys via Netlify).

**Content state:** the **Lead Generation** pillar is fully built — 8 articles (1 pillar + 7 sub-pillars), fully interlinked (see [Internal links](#internal-links-topic-cluster-mesh)). The other seven pillars are still placeholder.

### Hero images
- `heroImage: filename.jpg` in frontmatter → file lives at `public/images/filename.jpg` (convention: name it after the slug).
- It renders **everywhere the article appears**: the article page header (darkened background), topic-page cards, the homepage Featured Hero, and the homepage **Latest Playbooks** + **Spotlight** cards. Articles **without** a hero image fall back to a colored block with the accent word (the original homepage-card design).
- **Optimize before committing.** Source photos are often huge (4000px / 2+ MB). Resize the long edge to ~1920px and recompress to roughly <500 KB with macOS `sips`:
  ```bash
  sips -Z 1920 image.jpg                                # resize long edge to 1920px
  sips -s format jpeg -s formatOptions 58 image.jpg     # recompress (~quality 58)
  ```
- Homepage/topic cards use `object-fit: cover` at fixed heights, so the image is **center-cropped** — choose/crop photos that read well from the center.

### Internal links (topic-cluster mesh)
- The site is **`trailingSlash: 'always'`** — every internal link **must** end in a slash: `/{pillar}/{slug}/`. A slash-less link (`/lead-generation/real-estate-farming`) 404s, and the path is `/{pillar}/{slug}/`, **not** `/articles/{slug}/`.
- Within a topic cluster, link **every sub-pillar up to the pillar**, the **pillar down to every sub-pillar**, and **sub-pillars to one another** wherever the content makes the link organic — never link for the sake of linking.
- ⚠️ The `the-playbook-content` skill currently emits **slash-less** internal links (and once used an `/articles/...` path). Until that's patched in the skill, normalize at publish time:
  ```bash
  perl -i -pe 's{\]\(/lead-generation/([a-z0-9-]+)\)}{](/lead-generation/$1/)}g' \
    src/content/articles/lead-generation/*.md
  ```

---

## The 8 Content Pillars

| Slug | Display Name |
|---|---|
| `lead-generation` | Lead Generation |
| `marketing-and-branding` | Marketing & Branding |
| `sales-skills-and-scripts` | Sales Skills & Scripts |
| `business-systems` | Business Systems |
| `ai-and-technology` | AI & Technology |
| `mindset-and-performance` | Mindset & Performance |
| `growth-and-scaling` | Growth & Scaling |
| `the-fundamentals` | The Fundamentals |

Pillar slugs, display names, short names, and descriptions are defined in `src/data/pillars.ts`. These descriptions render on pillar archive pages, the homepage PillarStrip, and the Start Here topic grid — edit in one place.

---

## Homepage Sections (in order)

1. **PillarStrip** — horizontal 8-pillar navigation
2. **Featured Hero** — first article with `featured: true`, or most recent
3. **Latest Playbooks** — 2-col: feed (5 articles) + sidebar (newsletter widget + Most Read)
4. **Spotlight: Lead Generation** — 1 large + 3 small cards from `lead-generation`
5. **The Toolkit** — 4 resource cards; download modal subscribes to Beehiiv (`source: toolkit-download`)
6. **NewsletterBand** — "Build the Business. Run the Play." subscribe band (`source: newsletter-band`)
7. **From the Desk of Chris Linsell** — 3-card crossover block to ChrisLinsell.com
8. **Footer**

---

## Email Capture & Integrations

There are **two independent intake pipelines**:

1. **Beehiiv** (newsletter subscriptions) — via the Netlify Function.
2. **Netlify Forms** (email notifications to Chris) — for the resource-suggestion and writer-pitch forms.

### A. Beehiiv (newsletter)

All subscribe forms POST to `/.netlify/functions/newsletter-subscribe`, which proxies to the Beehiiv API server-side (keeps the API key out of the browser). The function:
- Subscribes the email (`reactivate_existing: true`, `send_welcome_email: true`).
- Sets `utm_source: 'website'` and **`utm_medium` = the form's `source`** (the placement).
- Sets **`referring_site`** = the page the signup happened on, read server-side from the request's `referer` header (no client changes needed).
- Fails gracefully: if credentials are missing it returns success silently; on a Beehiiv API error it logs `[subscribe] Beehiiv error: <status>` and returns 502. The client UI always shows confirmation regardless.

**Netlify environment variables required** (Netlify → Site configuration → Environment variables):
```
BEEHIIV_PUBLICATION_ID = pub_8ea0b955-576c-4da5-ba63-76d8de39dd9b   # MUST include the pub_ prefix
BEEHIIV_API_KEY        = <set in Netlify env vars + local .env only — never commit this>
```
> ⚠️ The publication ID **must** be `pub_`-prefixed. A bare UUID is rejected by Beehiiv with `400 INVALID_PATTERN`, which silently dropped every subscriber until fixed (2026-05-29).
> ⚠️ Beehiiv **rejects obviously-fake emails** — test with a real inbox (or a `+alias` on a real domain), not `test@example.com`.
> After changing env vars you must trigger a new deploy for them to take effect.

### B. Netlify Forms (email notifications)

Two forms use Netlify Forms (marked `data-netlify="true"` with a honeypot). Netlify detects them at build time and stores submissions; **you must add an email notification** per form to actually receive them:
**Netlify → Forms → Form notifications → Add notification → Email notification** (point at your address; can scope to a form or fire for all forms).

| Netlify form name | Source page | Purpose |
|---|---|---|
| `suggest-a-resource` | `/toolkit/` | Resource suggestions (also subscribes the sender to Beehiiv) |
| `write-for-us` | `/write-for-us/` | Writer pitches (email only — **not** subscribed to Beehiiv) |

### C. Full capture-point inventory

Every place a visitor can submit an email, and where it goes:

| Entry point | Appears on | Pipeline | `source` / `utm_medium` |
|---|---|---|---|
| Header "Get the Newsletter" | every page | Beehiiv | `footer-modal` * |
| Footer newsletter modal | every page | Beehiiv | `footer-modal` |
| Footer "Advertise" modal | every page | Beehiiv | `advertise` |
| Homepage sidebar widget | homepage | Beehiiv | `homepage-sidebar` |
| "Build the Business" band | 7 pages | Beehiiv | `newsletter-band` |
| Toolkit resource download | `/toolkit/` | Beehiiv | `toolkit-download` |
| Start Here "Start the Series" | `/start-here/` | Beehiiv | `start-here-series` |
| Suggest a Resource | `/toolkit/` | Beehiiv **+** Netlify Forms | `toolkit-suggestion` |
| Write for Us pitch | `/write-for-us/` | Netlify Forms only | — |

\* The header CTA programmatically opens the footer newsletter modal, so it tags as `footer-modal` (header vs. footer is not distinguished).

**Local dev note:** neither the Netlify Function nor Netlify Forms run under `astro dev`. Forms show their confirmation UI but don't actually send. Deploy to test live.

---

## Search

Header magnifying glass expands inline (nav crossfades out, search bar in; logo never moves).
- **Index:** `src/pages/search.json.ts` — generated at build time, served at `/search.json`
- **Logic:** client-side filter on title + description, up to 8 results
- **Close:** × button or Escape

---

## Deployment

Auto-deploys via Netlify on every push to `main`.

- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version (Netlify):** 22 (`netlify.toml`)
- **Manual deploy:** Netlify → Deploys → Trigger deploy → Deploy site

**Deploy etiquette:** push to GitHub freely, but each push triggers a build — keep an eye on build-credit usage (loose guideline: ~one deploy/day unless actively debugging).

After changing environment variables, trigger a fresh deploy for them to take effect.

---

## Key Quirks & Known Issues

### Do not add/import `@astrojs/netlify`
The adapter has been **removed** from `package.json` (2026-05-29). Don't reinstall or import it: the static site deploys to Netlify fine without any adapter, and on import the adapter probes local `.netlify/db` state and hangs the dev server.

### Client `<script>` tags must be `is:inline` plain JS
TypeScript annotations (`: string`, `as HTMLElement`, `<HTMLButtonElement>`, etc.) in a **processed** `<script>` cause Vite to fail silently — the script loads but no listeners bind. Always use `<script is:inline>` with plain JavaScript for interactivity. `define:vars` scripts are also inline (plain JS only). *(All client scripts were swept to comply on 2026-05-29.)*

### Use `entry.id`, not `entry.slug`
Astro removed `entry.slug` from content collections; use `entry.id` (the slug). Mixing them renders empty attributes and breaks interactivity.

### Beehiiv publication ID needs the `pub_` prefix; Beehiiv rejects fake emails
See [Beehiiv section](#a-beehiiv-newsletter). Both cost real debugging time — don't repeat them.

### Custom domain attached (2026-06-18)
`theplaybookre.com` is live on Netlify. GoDaddy DNS: apex `A → 75.2.60.5`, `www CNAME → the-playbook-re.netlify.app`. The old GoDaddy "WebsiteBuilder Site" parking A record was replaced; `_dmarc` and other records were preserved.

### `clPosts.ts` uses placeholder URLs
"From the Desk of Chris Linsell" (`src/data/clPosts.ts`) points all links to `https://chrislinsell.com/blog`. Update when real articles publish.

### Social icon links use placeholder handles
Footer social icons (Threads, LinkedIn, Instagram) link to `chrislinsell` profiles. Update with Playbook RE handles when created.

### Most Read is manually curated
Edit `src/data/mostRead.ts` (format: `pillar-slug/article-slug`).

### Lead Generation is real; the other 7 pillars are still placeholder
The **Lead Generation** pillar is fully built — 8 real articles (1 pillar + 7 sub-pillars), fully interlinked. The other seven pillars still hold a placeholder article or two created to fill card slots, and need replacing before launch.

### Internal links need a trailing slash (`trailingSlash: 'always'`)
Internal links must be `/{pillar}/{slug}/`; slash-less links 404 and the route is `/{pillar}/{slug}/`, not `/articles/{slug}/`. The `the-playbook-content` skill currently emits slash-less links — normalize at publish (see [Internal links](#internal-links-topic-cluster-mesh)).

### Several articles still carry `featured: true`
Eight articles (the Lead Generation pillar plus one leftover placeholder per other pillar) are flagged `featured: true`, so the homepage Featured Hero is just whichever sorts first. Trim to a single intended hero before launch.

### Privacy & Terms need attorney review
`src/pages/privacy.astro` and `src/pages/terms.astro` are drafted, not reviewed by counsel.

---

## Security Notes

- **Never commit secrets.** `.env` is gitignored (`.env`, `.env.*`, except `!.env.example`). Secrets live in Netlify env vars + local `.env` only.
- The Beehiiv API key was previously committed in this README in plaintext. It has since been **rotated** (the old key is dead) and replaced with a placeholder. The dead key still exists in old git history, but is harmless because it was revoked.
- If a secret is ever exposed again: **rotate it first** (that neutralizes the risk), then scrub the file. History rewriting is optional once rotated.

---

## Change Log

### 2026-06-06 — Lead Generation pillar fully built + internal link mesh
- **Lead Generation is now a complete topic cluster — 8 real articles.** Published the pillar page **"Real Estate Lead Generation: The Complete System"** (`/lead-generation/real-estate-lead-generation/`, `featured: true`) plus six sub-pillars across 6/4–6/5 — Postcards, Referrals, Prospecting, Buy Leads, Expired Listings, and Lead Conversion. With Farming (6/3), that completes the `lead-generation` set.
- **Removed 4 pre-launch placeholder articles** from `lead-generation` (`cold-calling-from-zero`, `expired-listing-system`, `open-house-lead-machine`, `sphere-of-influence-playbook`) — scaffold stubs never run through the content pipeline, two of them superseded by real articles.
- **Built the internal link mesh:** every sub-pillar links up to the pillar, the pillar links down to all seven subs, and organic sub-to-sub links connect related tactics. Link markup only — no prose changed.
- **Normalized internal-link paths:** the site is `trailingSlash: 'always'`, so all internal links were fixed to `/{pillar}/{slug}/` (slash-less links 404), plus one broken `/articles/...` path. **Heads-up:** `the-playbook-content` emits slash-less links — fix at publish time or patch the skill (see [Internal links](#internal-links-topic-cluster-mesh)).
- **Publishing has its own skill now:** `playbook-publishing-bot` handles step 2 (route file + hero into the repo, validate, build, verify directives + links, deploy).

### 2026-06-03 — First article live, hero images, content skill
- **Published the first real article:** "Real Estate Farming: How to Own a Neighborhood's Listings" at `/lead-generation/real-estate-farming/`, with an optimized hero image (`public/images/real-estate-farming.jpg`, 2.3 MB → ~421 KB via `sips`).
- **Homepage cards now show hero images:** wired the Latest Playbooks feed and Spotlight cards to render `heroImage` (`object-fit: cover`, tag badge overlaid), falling back to the colored accent-word block when an article has none. Previously these sections ignored `heroImage`, so homepage thumbnails were missing for articles with photos.
- **Content pipeline established:** articles are authored in Claude Cowork via the `the-playbook-content` skill (keyword/intent/angle → Ahrefs + live research → approved outline → voice/SEO/GEO draft → scored → markdown), then implemented here. See "Content Creation & Publishing Workflow."
- **Docs:** added plain-text `README.txt` and `docs/article-content-elements.txt` for sharing outside a markdown renderer.

### 2026-05-29 — Forms, tracking, content blocks, security
- **Dev server fixed:** corrupted `node_modules` (missing `html-void-elements`) → clean reinstall; now on Astro **6.4.2**.
- **Root-cause fix:** `BEEHIIV_PUBLICATION_ID` was a bare UUID → Beehiiv `400`s → **no subscribers were ever added** by any form. Added the required `pub_` prefix.
- **Security:** removed the live Beehiiv API key that was committed in this README; key rotated.
- **Wired up every broken capture point:** the NewsletterBand "Subscribe" button (had no handler), the Start Here series modal (TS-in-script silent failure), and the toolkit download modal (never called the function) all now subscribe.
- **Per-placement tracking:** the function now maps `source` → `utm_medium` and records the signup page via `referring_site`. Retagged sources for uniqueness (`homepage-sidebar`, `footer-modal`, `toolkit-download`, etc.).
- **New feature:** "Suggest a Resource" form on `/toolkit/` (Netlify Forms email + Beehiiv subscribe).
- **Wired Write-for-Us pitch form** to Netlify Forms (was silently dropping pitches).
- **Article blocks:** added `remark-directive` + `src/plugins/remark-playbook-blocks.mjs` so `:::callout` / `:::warning` / `:::phase` render styled at build time (previously showed literal `:::` markers in all 9 articles).
- **Script sweep:** converted remaining TypeScript-laden `<script>` tags to `is:inline` plain JS.
- **Copy edits:** pillar descriptions (Lead Gen, Marketing), Start Here (hero/intro/3 paths + label alignment), Toolkit (hero, coming-soon, meta/JSON-LD), About (why-this-exists, Chris bio, editorial standards, agent cards), Write for Us.
- **Dependency cleanup:** removed unused `@astrojs/netlify` and pinned `astro` to `6.4.2`.

---

## Outstanding Before Launch

- [x] **Attach the custom domain** `theplaybookre.com` to the Netlify site — done 2026-06-18 (apex A → 75.2.60.5, www CNAME → the-playbook-re.netlify.app, HTTPS live).
- [ ] **Set up Netlify Forms email notifications** for `suggest-a-resource` and `write-for-us` (and verify they fire).
- [ ] Replace placeholder content in the other 7 pillars (**Lead Generation done** — 8 articles, fully meshed).
- [ ] Trim stray `featured: true` flags to one intended Featured Hero (currently 8 are flagged).
- [ ] Add real hero images to articles (`public/images/`, reference in frontmatter).
- [ ] Update `src/data/clPosts.ts` with real ChrisLinsell.com article URLs.
- [ ] Update footer social icon links with Playbook RE account handles.
- [ ] Attorney review of `/privacy/` and `/terms/`.

### Done (2026-05-29)
- [x] Confirm Beehiiv env vars set in Netlify + correct `pub_` publication ID.
- [x] Verify subscribers actually flow into Beehiiv (confirmed end-to-end).
- [x] Wire all newsletter capture points + the suggest/pitch forms.
- [x] Fix `:::callout` / `:::warning` / `:::phase` rendering.
- [x] Remove the API key from the README + rotate it.
- [x] Remove unused `@astrojs/netlify` from `package.json`.
- [x] Pin `astro` to an exact version (`6.4.2`).
