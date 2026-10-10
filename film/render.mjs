// Usage: node render.mjs stills out_dir t1 t2 ...   |   node render.mjs video out.mp4 [fps=60]
import { createRequire } from 'node:module'; import { execSync } from 'node:child_process';
const { chromium } = createRequire(execSync('npm root -g').toString().trim() + '/')('playwright');
import { spawn } from 'node:child_process';
import path from 'node:path'; import fs from 'node:fs';
const [mode, out, ...rest] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => m.type() === 'error' && errs.push(m.text()));
await page.goto('file://' + path.resolve('index.html'));
await page.evaluate(() => document.fonts.ready);
const shot = async t => { await page.evaluate(t => renderAt(t), t); return page.locator('canvas').screenshot({ type: 'jpeg', quality: 92 }); };
if (mode === 'stills') {
  fs.mkdirSync(out, { recursive: true });
  for (const t of rest.map(Number)) fs.writeFileSync(`${out}/t${t.toFixed(2)}.jpg`, await shot(t));
} else {
  const fps = Number(rest[0] || 60), dur = await page.evaluate(() => window.DURATION), n = Math.round(dur * fps);
  const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-i', 'audio.mp3',
    '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p',
    '-c:a', 'aac', '-b:a', '256k', '-shortest', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < n; i++) { const buf = await shot(i / fps); if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r)); if (i % 120 === 0) console.log(`frame ${i}/${n}`); }
  ff.stdin.end(); await new Promise(r => ff.on('close', r));
}
if (errs.length) console.log('PAGE ERRORS:', errs);
await browser.close();
