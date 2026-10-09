import fs from 'fs';
import path from 'path';

function bundle() {
  const distDir = path.resolve('dist');
  const indexHtmlPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.error('dist/index.html not found');
    return;
  }

  let html = fs.readFileSync(indexHtmlPath, 'utf8');
  const assetsDir = path.join(distDir, 'assets');
  const files = fs.readdirSync(assetsDir);

  let css = '';
  let js = '';

  for (const f of files) {
    if (f.endsWith('.css')) {
      css += fs.readFileSync(path.join(assetsDir, f), 'utf8') + '\n';
    } else if (f.endsWith('.js')) {
      js += fs.readFileSync(path.join(assetsDir, f), 'utf8') + '\n';
    }
  }

  // Inline CSS
  html = html.replace(/<link[^>]+rel="stylesheet"[^>]+>/g, `<style>\n${css}\n</style>`);
  // Inline JS
  html = html.replace(/<script[^>]+src="\/assets\/[^"]+"[^>]*><\/script>/g, `<script type="module">\n${js}\n</script>`);

  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outPath = path.join(publicDir, 'kawach-index.html');
  fs.writeFileSync(outPath, html, 'utf8');
  console.log(`Bundle generated successfully at ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
}

bundle();
