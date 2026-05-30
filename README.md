# The Playbook RE — Site Documentation

**Live site:** https://theplaybookre.com  
**GitHub repo:** git@github.com:christto223/theplaybookre-site.git  
**Hosting:** Netlify (auto-deploys from `main` branch)  
**Built with:** Astro 6, static output, no SSR adapter required

---

## Running the Dev Server

### The known problem
`npm` requires Node to be in your shell PATH. Due to a `brew shellenv` bug on this machine, new terminal windows sometimes open without Homebrew in PATH, making `npm` unavailable.

### Reliable fix — use the absolute path:
```bash
/opt/homebrew/Cellar/node/26.0.0/bin/node "/Users/christopherlinsellmba/Desktop/Claude Code/theplaybookre-site/node_modules/.bin/astro" dev
```

### If npm is working normally:
```bash
cd "/Users/christopherlinsellmba/Desktop/Claude Code/theplaybookre-site"
npm run dev
```

The server runs on **http://localhost:4321** (or 4322 if 4321 is taken).

### Critical: Node version must be 26
- **Node 26.0.0** — works correctly
- **Node 22.x** — hangs with no output (ESM/startup incompatibility)
- **Node 25.x** — broken system library (`libsimdjson.29.dylib` missing after Homebrew update)

Check/switch Node version:
```bash
/opt/homebrew/bin/node --version          # should say v26.0.0
brew unlink node@22 && brew link node     # switch back to Node 26 if needed
```

After switching Node versions, always reinstall node_modules:
```bash
rm -rf node_modules package-lock.json .astro
npm install
```

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Astro 6 (static output) |
| Hosting | Netlify |
| Adapter | None — static HTML deploys fine without one |
| Sitemap | `@astrojs/sitemap` |
| Email list | Beehiiv (via Netlify Function) |
| Fonts | Bebas Neue, Inter, DM Sans (Google Fonts) |
| Styles | Scoped CSS in `.astro` files + `src/styles/global.css` |

**Important:** `@astrojs/netlify` is listed in `package.json` but intentionally NOT imported in `astro.config.mjs`. Importing it caused the dev server to hang by probing the local `.netlify/db` state. Remove it from `package.json` on the next cleanup.

---

## Project Structure

```
theplaybookre-site/
├── src/
│   ├── components/
│   │   ├── Masthead.astro         # Sticky header with search, nav, newsletter CTA
│   │   ├── Footer.astro           # Full footer with modals (newsletter + advertise)
│   │   ├── NewsletterBand.astro   # "Build the Business" 2-col subscription section
│   │   ├── PillarStrip.astro      # 8-pillar horizontal nav strip
│   │   ├── ArticleCard.astro      # Reusable article card
│   │   └── SEOHead.astro          # Meta tags, OG, schema injection
│   ├── layouts/
│   │   ├── BaseLayout.astro       # Universal page shell (Masthead + Footer)
│   │   └── ArticleLayout.astro    # Article detail page shell
│   ├── pages/
│   │   ├── index.astro            # Homepage (all sections)
│   │   ├── [pillar]/
│   │   │   ├── index.astro        # Pillar archive page (e.g. /lead-generation/)
│   │   │   └── [slug].astro       # Article detail page
│   │   ├── playbooks/index.astro  # All articles archive
│   │   ├── toolkit/index.astro    # Free resources page
│   │   ├── start-here.astro       # Start Here page
│   │   ├── about.astro            # About page
│   │   ├── write-for-us.astro     # Pitch submission page
│   │   ├── privacy.astro          # Privacy policy
│   │   ├── terms.astro            # Terms of use
│   │   └── search.json.ts         # Static search index (all articles as JSON)
│   ├── content/
│   │   ├── articles/              # All editorial content (markdown)
│   │   │   ├── lead-generation/
│   │   │   ├── marketing-and-branding/
│   │   │   ├── sales-skills-and-scripts/
│   │   │   ├── business-systems/
│   │   │   ├── ai-and-technology/
│   │   │   ├── mindset-and-performance/
│   │   │   ├── growth-and-scaling/
│   │   │   └── the-fundamentals/
│   │   └── toolkit/               # Downloadable resource definitions (markdown)
│   ├── data/
│   │   ├── pillars.ts             # The 8 content pillars (slug, name, shortName, color)
│   │   ├── mostRead.ts            # Manually curated Most Read article IDs
│   │   └── clPosts.ts             # ChrisLinsell.com crossover posts (manual, static)
│   └── styles/
│       └── global.css             # CSS custom properties (brand tokens, fonts)
├── netlify/
│   └── functions/
│       └── newsletter-subscribe.js  # Beehiiv API proxy (keeps API key server-side)
├── astro.config.mjs               # Astro config (sitemap only, no adapter)
├── netlify.toml                   # Netlify build config
└── .env                           # Local credentials (gitignored)
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

**Typography:** Bebas Neue (all headings/display), Inter (UI/labels), DM Sans (body copy)

---

## Content Collections

Defined in `src/content.config.ts`.

### Articles
Path: `src/content/articles/{pillar}/{slug}.md`

Required frontmatter:
```yaml
---
title: "Your Article Title"
description: "One sentence description for cards and SEO."
publishDate: 2025-05-01
pillar: lead-generation          # must match a slug in src/data/pillars.ts
tags: ["Cold Calling"]           # first tag displays on cards
readTime: 8                      # minutes
accentWord: "Zero"               # word highlighted yellow in title display
featured: false                  # true = appears as Featured Hero on homepage
draft: false                     # true = excluded from all collections
heroImage: filename.jpg          # optional, place in public/images/
---
```

### Toolkit Resources
Path: `src/content/toolkit/{slug}.md`

Required frontmatter:
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

---

## Homepage Sections (in order)

1. **PillarStrip** — horizontal 8-pillar navigation
2. **Featured Hero** — first article with `featured: true`, or most recent
3. **Latest Playbooks** — 2-col layout: feed (5 articles) + sidebar (newsletter widget + Most Read)
4. **Spotlight: Lead Generation** — 1 large + 3 small cards from `lead-generation` pillar
5. **The Toolkit** — 4 resource cards with download modal (triggers Beehiiv subscribe)
6. **NewsletterBand** — "Build the Business. Run the Play." 2-col subscribe section
7. **From the Desk of Chris Linsell** — 3-card crossover block linking to ChrisLinsell.com
8. **Footer** — full site footer

---

## Beehiiv Integration

**How it works:**
All subscribe forms POST to `/.netlify/functions/newsletter-subscribe`, which proxies to the Beehiiv API server-side (keeps the API key out of the browser).

**Netlify environment variables required** (set in Netlify → Site Settings → Environment Variables):
```
BEEHIIV_PUBLICATION_ID = pub_8ea0b955-576c-4da5-ba63-76d8de39dd9b
BEEHIIV_API_KEY        = <set in Netlify env vars + local .env only — never commit this>
```

**Forms wired to Beehiiv:**
- Header "Get the Newsletter" button → triggers footer modal → Beehiiv
- Footer newsletter modal → Beehiiv (`source: 'newsletter'`)
- Homepage sidebar newsletter widget → Beehiiv (`source: 'newsletter'`)
- Footer "Advertise" modal → Beehiiv (`source: 'advertise'`, tagged with `utm_medium: advertising-interest`)

**Local dev note:** The Netlify Function does not run during `npm run dev`. Forms show the confirmation UI but don't actually send to Beehiiv locally. Deploy to Netlify to test live.

---

## Search

The header magnifying glass expands inline (nav fades out, search bar fades in).

- **Index:** `src/pages/search.json.ts` — generated at build time, served at `/search.json`
- **Logic:** client-side filter on title + description, up to 8 results
- **Results:** fixed dropdown panel below the header

---

## Deployment

Auto-deploys via Netlify on every push to `main`.

Build command: `npm run build`  
Publish directory: `dist`  
Node version (on Netlify): 22 (set in `netlify.toml`)

**To trigger a manual deploy:** Netlify dashboard → Deploys → Trigger deploy → Deploy site

**After setting new environment variables**, you must trigger a new deploy for them to take effect.

---

## Key Quirks & Known Issues

### Do not import `@astrojs/netlify`
It's in `package.json` but must NOT be imported in `astro.config.mjs`. The package probes local `.netlify/db` state on import and hangs the dev server indefinitely. The static site deploys fine to Netlify without any adapter.

### Script tags in Astro components must use `is:inline`
TypeScript annotations in `<script>` tags (e.g. `param: string`, `as HTMLInputElement`) cause Vite to fail silently — scripts appear to load but no event listeners bind. Always use `<script is:inline>` with plain JavaScript for component interactivity.

### `clPosts.ts` uses placeholder URLs
The "From the Desk of Chris Linsell" crossover section (`src/data/clPosts.ts`) currently points all articles to `https://chrislinsell.com/blog`. Update with real article URLs when they're published.

### Social icon links use placeholder handles
Footer social icons (Threads, LinkedIn, Instagram) currently link to `chrislinsell` profiles. Update with The Playbook RE account handles when created.

### Article detail pages exist but content is mostly placeholder
Articles in `src/content/articles/` render via `src/pages/[pillar]/[slug].astro`. Most articles are placeholder content created to fill homepage card slots. Real articles need to be written and added before launch.

### Most Read is manually curated
Edit `src/data/mostRead.ts` to control which articles appear in the Most Read sidebar. Uses article IDs (e.g. `lead-generation/cold-calling-from-zero`).

### Privacy & Terms need attorney review before launch
`src/pages/privacy.astro` and `src/pages/terms.astro` are drafted but have not been reviewed by counsel.

---

## Outstanding Before Launch

- [ ] Replace all placeholder article content with real articles
- [ ] Update `src/data/clPosts.ts` with real ChrisLinsell.com article URLs
- [ ] Update footer social icon links with Playbook RE account handles
- [ ] Attorney review of `/privacy/` and `/terms/`
- [ ] Confirm Beehiiv env vars are set in Netlify and trigger a deploy
- [ ] Add real hero images to articles (place in `public/images/`, reference in frontmatter)
- [ ] Complete remaining homepage copy changes (NewsletterBand body text, stats, toolkit subtitle, CL subtitle, sidebar newsletter copy — partially done, session was interrupted)
- [ ] Remove `@astrojs/netlify` from `package.json` dependencies (it's unused and caused dev server issues)
