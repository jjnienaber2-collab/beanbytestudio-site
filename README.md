# BeanByte Studio website

The studio's public site: who we are and links to Headroom and Trade Tracker. Plain HTML and CSS, hosted free on Cloudflare.

- How it works and how to change it, in plain English: `docs/LEARN.md`
- Brand rules and the human-made checklist: the BeanByte Studio Brand Guide

## Files

| Path | What it is |
|---|---|
| `public/index.html` | Home page |
| `public/about.html` | About page |
| `public/404.html` | Shown for any page that doesn't exist |
| `public/styles.css` | All colours, fonts and layout |
| `public/img/` | Logo and real app screenshots |
| `wrangler.jsonc` | Tells Cloudflare to serve the `public/` folder |

## Commands

| Command | What it does |
|---|---|
| `npx wrangler dev` | Runs the site on your computer at http://localhost:8787 |
| `npx wrangler deploy` | Publishes the site (Cloudflare does this for you on every push to `main`) |

## Checks and deploying

- `npm run check` checks the pages in `public/`: titles, phone viewport, links between pages, the four social links, and no placeholders left in.
- `npm run deploy` runs that check, deploys with Wrangler, then checks the live site matches `public/` (it retries for 30 seconds while the new version spreads).
- GitHub runs `npm run check` on every push and pull request.
