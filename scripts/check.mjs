// Checks the studio site before and after a deploy. No packages needed, just Node.
//
//   node scripts/check.mjs           the files in public/: titles, links, socials, no placeholders
//   node scripts/check.mjs --live    the same pages on the live site, plus a real 404
//
// `npm run deploy` runs the first, deploys, then runs the second.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUB = path.join(ROOT, 'public');
const LIVE = 'https://beanbytestudio-site.beanbytes.workers.dev';
const live = process.argv.includes('--live');

// The four socials every page with a "follow" section must link to (not Reddit).
const SOCIALS = [
  'https://x.com/beanbytestudio',
  'https://www.instagram.com/beanbytestudio/',
  'https://bsky.app/profile/beanbytestudio.bsky.social',
  'https://www.tiktok.com/@beanbyte.studio',
];
const PAGES = { '/': 'index.html', '/about': 'about.html' };

let failures = 0;
const ok = (m) => console.log(`  \x1b[32m✓\x1b[0m ${m}`);
const fail = (m) => { failures++; console.log(`  \x1b[31m✗ ${m}\x1b[0m`); };

function pageProblems(name, html) {
  const p = [];
  if (!/<title>[^<]+<\/title>/.test(html)) p.push('no <title>');
  if (!/<meta name="viewport"/.test(html)) p.push('no viewport meta (phones)');
  const placeholder = html.match(/\[(YOUR|TODO|TBD)[^\]]*\]|lorem ipsum/i);
  if (placeholder) p.push(`placeholder left in: ${placeholder[0].slice(0, 40)}`);
  for (const href of html.match(/href="\/[^"#]*"/g) || []) {
    const url = href.slice(6, -1);
    const file = url === '/' ? 'index.html' : url.slice(1);
    const exists = [file, file + '.html', path.join(file, 'index.html')].some((f) => fs.existsSync(path.join(PUB, f)));
    if (!exists) p.push(`broken link ${url}`);
  }
  if (name !== '404.html') for (const s of SOCIALS) if (!html.includes(`href="${s}"`)) p.push(`missing social link ${s}`);
  return p;
}

console.log(`\x1b[1mStudio site check\x1b[0m — ${live ? LIVE : 'public/'}`);
if (!live) {
  for (const name of fs.readdirSync(PUB).filter((f) => f.endsWith('.html'))) {
    const p = pageProblems(name, fs.readFileSync(path.join(PUB, name), 'utf8'));
    p.length ? fail(`${name}: ${p.join('; ')}`) : ok(name);
  }
} else {
  // A new deploy can take a few seconds to reach every edge, so try up to 3 times.
  for (let attempt = 1; attempt <= 3; attempt++) {
  failures = 0;
  if (attempt > 1) { console.log(`  …trying again in 10 s [${attempt}/3]`); await new Promise((r) => setTimeout(r, 10_000)); }
  for (const [route, name] of Object.entries(PAGES)) {
    try {
      const r = await fetch(LIVE + route);
      const html = await r.text();
      const local = fs.readFileSync(path.join(PUB, name), 'utf8');
      const title = (local.match(/<title>([^<]+)<\/title>/) || [])[1];
      const p = r.status === 200 ? pageProblems(name, html) : [`status ${r.status}`];
      if (title && !html.includes(title)) p.push('live page is not this version (title differs)');
      if (html !== local) p.push('live page differs from public/' + name + ' (deploy not finished, or not deployed)');
      p.length ? fail(`${route}: ${p.join('; ')}`) : ok(`${route} matches public/${name}`);
    } catch (e) { fail(`${route}: ${e.message}`); }
  }
  try {
    const r = await fetch(LIVE + '/no-such-page-' + Date.now());
    r.status === 404 && (await r.text()).includes('<title>') ? ok('unknown pages get the 404 page') : fail(`unknown page → ${r.status}`);
  } catch (e) { fail('404 check: ' + e.message); }
  if (!failures) break;
  }
}
console.log(failures ? `\n\x1b[31m\x1b[1mCHECK FAILED\x1b[0m — ${failures} problem${failures > 1 ? 's' : ''}.\n` : '\n\x1b[32m\x1b[1mCHECK PASSED\x1b[0m\n');
process.exit(failures ? 1 : 0);
