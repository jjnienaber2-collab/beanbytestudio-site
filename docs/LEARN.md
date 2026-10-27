# How the BeanByte Studio website works

Short explanations of what each piece does and why, plus small hands-on tasks. Read one section at a time.

## 1. What a website is

A website is a folder of files that a server sends to your browser. This site has three kinds:

- **HTML** (`index.html`, `about.html`) holds the content: headings, paragraphs, links and images. Tags like `<h1>` (main heading), `<p>` (paragraph) and `<a href="...">` (link) tell the browser what each piece is.
- **CSS** (`styles.css`) holds the look: colours, fonts, spacing and layout. Every page links to the same stylesheet, so changing one colour there changes it everywhere.
- **Images** (`img/`) are the logo and real screenshots of the apps.

**Why plain HTML and CSS:** the site only shows information, so it doesn't need a framework like React (which Headroom uses). Fewer moving parts means nothing to install, nothing to break, and pages that load fast on a phone.

## 2. Where the colours and fonts come from

The top of `styles.css` defines named colours, like `--crema: #d1ac5b;`. The rest of the file uses the names, like `color: var(--crema);`. That's why the site matches the Brand Guide: change the value once at the top and every use updates.

The fonts are IBM Plex Sans and IBM Plex Mono, loaded free from Google Fonts by the `<link>` line in each page's `<head>`.

## 3. How it gets online

1. The files live on GitHub in `beanbytestudio-site`.
2. Cloudflare watches the `main` branch. On every push, it runs `npx wrangler deploy`, which uploads the `public/` folder.
3. `wrangler.jsonc` tells Cloudflare which folder to serve and what to do with unknown addresses (show `404.html`).

Hosting this way is free: static files on Cloudflare cost nothing at our size.

## 4. Phones

At the bottom of `styles.css`, the `@media (max-width: 760px)` block only applies on narrow screens. It stacks the text and screenshots into one column. Most traders will see the site on a phone, so it's checked at phone width before every change.

## Your hands-on tasks

### Task 1: write your story (about 15 minutes)

1. On GitHub, open `public/about.html` and click the pencil icon to edit.
2. Find the line starting `<p class="todo">[YOUR STORY`.
3. Replace everything between `<p>` and `</p>` with two or three sentences in your own words. Then change `<p class="todo">` to just `<p>`, which removes the dashed box.
4. Click **Commit changes**. In about a minute, Cloudflare publishes it.

**What you just learned:** HTML tags wrap content, a `class` connects an element to a style in the CSS, and a commit to `main` is a deploy.

### Task 2: change a colour and change it back (5 minutes)

In `styles.css`, change `--crema: #d1ac5b;` to `--crema: #5b9bd1;`, commit, and look at the live site: every gold detail turns blue. Then change it back. This shows why colours are named once at the top.
