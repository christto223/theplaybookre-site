# The Playbook RE — Article Content Elements

A reference for writing article markdown for The Playbook RE. These are the
**only** display components the site can render. Use them to make articles
scannable, credible, and visually varied beyond plain body copy.

> ## The one rule
> The site renders custom elements from a fixed set of `:::` directives
> (listed below) plus standard markdown. **If you invent a directive name that
> isn't in this doc** (e.g. `:::sidebar`), it will render as literal `:::sidebar`
> text in the published article. Only use the directives documented here.
>
> Directives are transformed at **build time** by `src/plugins/remark-playbook-blocks.mjs`.
> Styles live in `src/styles/global.css`.

---

## 1. Standard Markdown (always available)

| Element | Markdown | Notes |
|---|---|---|
| Section header (H2) | `## Heading` | Bebas Neue, yellow left border. Use to break major sections. |
| Subheader (H3) | `### Heading` | Bebas Neue, no border. Use within sections. (Also has special meaning inside `:::phase`, `:::proscons`, `:::checklist` — see below.) |
| Body copy | plain text | DM Sans, 17px. The default narrative voice. |
| Bold / italic | `**bold**` / `_italic_` | |
| Links | `[text](url)` | Yellow underline. |
| Bulleted / numbered list | `- item` / `1. item` | Standard styled lists. |
| **Comparison table** | standard markdown table | Styled with a black header row and striped rows. **`✓` and `✗` characters inside cells are auto color-coded** (green / red) — use them for feature matrices. |

**Comparison table example:**
```markdown
| Feature | Tool A | Tool B |
|---|---|---|
| CRM sync | ✓ | ✗ |
| Free tier | ✗ | ✓ |
```
Use a real markdown table for any side-by-side evaluation of tools, plans, or approaches.

---

## 2. Custom Elements (the `:::` directive catalog)

### Emphasis & Highlight

#### `:::callout` — generic emphasis box
Yellow left-border box. For an important aside or a point you want to stop the reader on. Lead with a bold phrase.
```markdown
:::callout
**Why this matters:** The fundamentals compound. Skipping them is the #1 reason new agents wash out.
:::
```

#### `:::protip` — tactical tip
Pale-yellow box, "PRO TIP" badge. For a specific shortcut, sourcing tip, or tactical nudge. Can appear a few times per article.
```markdown
:::protip
Pull the property history before every listing call. Thirty seconds of prep changes the whole conversation.
:::
```

#### `:::warning` — common mistake / caution
Pale-yellow box, "⚠ WARNING" badge. For the most common error agents make on this topic. **Use sparingly — about once per article.**
```markdown
:::warning
Don't confuse activity with progress. A full calendar of low-intent appointments is how producing agents quietly stall out.
:::
```

#### `:::takeaways` — key takeaways box
Yellow-bordered box, "KEY TAKEAWAYS" badge, arrow bullets. Place near the **top** of the article to surface the 4–6 points the reader should leave with. Contains a bullet list.
```markdown
:::takeaways
- First point readers should walk away with.
- Second point that matters just as much.
- Third, slightly longer takeaway.
:::
```

#### `:::stat{value="…"}` — single dramatic stat
Yellow box, huge number on the left, context on the right. For one anchoring data point. Put the headline figure in `value`, the context in the body.
```markdown
:::stat{value="73%"}
of agents who follow up within five minutes convert at roughly three times the rate of those who wait an hour.
:::
```

#### `:::quote{cite="…"}` — pull quote
Black box, large white display type, optional citation. Breaks up long sections and surfaces a key idea. Use `_word_` to make one word yellow. `cite` is optional.
```markdown
:::quote{cite="Chris Linsell, CMO"}
The agents who win aren't the ones with the best _scripts_. They're the ones who show up the most consistently.
:::
```

#### `:::verdict{title="…"}` — editorial close
Yellow box, "THE PLAYBOOK VERDICT" badge, optional headline. The definitive take. Place at the **end** of the article body. **One per article.**
```markdown
:::verdict{title="Start with the fundamentals."}
Master the boring, repeatable basics first. Everything else builds on them.
:::
```

### Structured Data

#### `:::phase` — numbered sequential framework
White container, yellow top border, numbered badges with a connector line. For any ordered, connected sequence of steps (3, 4, 5… steps all work). Each step is an `### heading` + the body that follows it; steps are auto-numbered.
```markdown
:::phase
### Step 1: Research the Property
Pull history, assess condition, understand comparables.

### Step 2: Pre-Appointment Call
Call 48 hours ahead to understand timeline and surface concerns.
:::
```

#### `:::proscons` — two-column pros/cons
Two columns. The **first** `### heading` + list is the positive column (green ✓), the **second** is the negative column (red ✗). Use exactly two `###` groups. Headings are your choice (e.g. "Why It Works" / "Why Agents Quit").
```markdown
:::proscons
### Why It Works
- Compounds over time
- Cheap to start

### Why Agents Quit
- Slow to show results
- Requires daily discipline
:::
```

#### `:::checklist{title="…"}` — reference protocol
White container, titled badge, yellow square bullets. For a repeatable process the reader will return to. Optional `### headings` create labeled sub-sections (e.g. Prep / During / After). Not an interactive to-do — it's a reference.
```markdown
:::checklist{title="Daily Prospecting Checklist"}
### Prep
- Review yesterday's follow-ups
- Pull today's call list

### During
- Log every conversation in the CRM
:::
```

#### `:::quickfacts` — at-a-glance stat grid
Black 4-column grid of value + label cells. For a cluster of related numbers. Author as a bullet list where each item is `**value** label`.
```markdown
:::quickfacts
- **2,847** Homes sold under management
- **18 yrs** Average team tenure
- **$1.2B** Lifetime sales volume
- **4.9★** Average client rating
:::
```
> Best with 2 or 4 items (grid is 4-wide on desktop, 2-wide on mobile).

### Inline Interrupt

#### `:::newsletter{heading="…"}` — mid-article subscribe CTA
Black band with a Subscribe button that opens the site's newsletter modal. Place once, after a natural mid-article break. `heading` is optional.
```markdown
:::newsletter{heading="Get playbooks like this every Monday."}
:::
```
(Leave the body empty — the heading attribute supplies the text.)

---

## 3. Choosing the Right Element

| If you want to… | Use |
|---|---|
| Stop the reader on one important point | `:::callout` |
| Give a tactical shortcut or tip | `:::protip` |
| Flag a common mistake | `:::warning` (max ~1) |
| Summarize the whole piece up top | `:::takeaways` |
| Anchor a section with one big number | `:::stat` |
| Show a cluster of related numbers | `:::quickfacts` |
| Break up text with a memorable line | `:::quote` |
| Walk through ordered steps | `:::phase` |
| Weigh a strategy/tool both ways | `:::proscons` |
| Give a repeatable reference process | `:::checklist` |
| Compare tools/plans side by side | markdown table (with ✓/✗) |
| Capture an email mid-read | `:::newsletter` (max 1) |
| Deliver the definitive closing take | `:::verdict` (max 1, at the end) |

---

## 4. Density & Usage Guidelines

- **Don't use every element.** A ~2,000-word article might have: Key Takeaways + 1 Stat + 1 Pull Quote + 1 Pro Tip + 1 inline CTA + 1 Verdict. A ~4,000-word piece can support more.
- **One per article:** `:::verdict` (at the end), `:::newsletter`, and ideally `:::warning`.
- **Top of article:** `:::takeaways`. **End of article:** `:::verdict`.
- **Comparison tables / quickfacts** are for articles that genuinely have data to compare — don't force them into pure-strategy pieces.
- **`:::phase`** is for *connected, ordered* steps. If steps aren't sequential, use a normal list or `:::checklist`.
- Lead `:::callout` bodies with a **bold phrase**, then the explanation.

---

## 5. Article Frontmatter (required for every article)

```yaml
---
title: "Your Article Title"
description: "One-sentence dek — also used as the card/SEO excerpt."
publishDate: 2026-05-01
pillar: lead-generation          # one of the 8 pillar slugs
tags: ["Cold Calling"]           # first tag shows on cards
readTime: 8                      # minutes
accentWord: "Zero"               # ONE word from the title, rendered yellow in the H1
featured: false                  # true = Featured Hero on homepage
draft: false                     # true = excluded from the build entirely
heroImage: filename.jpg          # optional; file goes in public/images/
---
```
- **`accentWord`** must be a single word that appears in the title; it renders yellow in the article H1.
- **`description`** doubles as the italic dek under the H1 and the excerpt on cards.
- **`pillar`** must be one of: `lead-generation`, `marketing-and-branding`, `sales-skills-and-scripts`, `business-systems`, `ai-and-technology`, `mindset-and-performance`, `growth-and-scaling`, `the-fundamentals`.

---

*Source of truth: `src/plugins/remark-playbook-blocks.mjs` (transforms) and `src/styles/global.css` (styles). If a new element is added there, add it here too.*
