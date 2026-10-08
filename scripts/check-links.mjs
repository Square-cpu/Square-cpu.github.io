import { readdir, readFile, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const root = resolve('dist');
const base = (process.env.BASE_PATH || '/').replace(/\/$/, '');
const files = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (entry.name.endsWith('.html')) files.push(path);
  }
}
await walk(root);
const failures = [];
for (const file of files) {
  const html = await readFile(file, 'utf8');
  const urls = [...html.matchAll(/(?:href|src|poster)="([^"]+)"/g)].map(match => match[1]);
  for (const match of html.matchAll(/srcset="([^"]+)"/g)) {
    urls.push(...match[1].split(',').map(candidate => candidate.trim().split(/\s+/)[0]));
  }
  for (const href of urls) {
    if (/^(https?:|mailto:|tel:|data:|\/\/)/.test(href)) continue;
    const url = new URL(href, `https://local.invalid${base}/${file.slice(root.length + 1).replaceAll('\\', '/')}`);
    if (base && !url.pathname.startsWith(`${base}/`)) {
      failures.push(`${file}: missing base in ${href}`);
      continue;
    }
    let target = join(root, decodeURIComponent(url.pathname.slice(base.length)));
    try {
      if ((await stat(target)).isDirectory()) target = join(target, 'index.html');
      await stat(target);
      if (url.hash && target.endsWith('.html')) {
        const targetHtml = await readFile(target, 'utf8');
        if (!targetHtml.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`)) failures.push(`${file}: missing anchor ${href}`);
      }
    } catch { failures.push(`${file}: missing ${href}`); }
  }
}
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log(`Checked local links, assets, and anchors across ${files.length} pages (base: ${base || '/'}).`);
