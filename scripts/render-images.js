#!/usr/bin/env node
'use strict';

/*
 * Рисует картинки сайта в src/ (их нужно перерисовать после смены логотипа или заголовков):
 *   src/og/og-<язык>.png     — превью для соцсетей и мессенджеров, 1200×630
 *   src/apple-touch-icon.png — значок для экрана «Домой» на iPhone, 180×180
 *   src/favicon-32.png       — значок вкладки для браузеров без поддержки SVG
 *
 * Нужен браузер через playwright-core (в зависимости проекта не входит):
 *   npm i --no-save playwright-core && npx playwright-core install chromium
 *   node scripts/render-images.js
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');
const i18n = require('../src/js/i18n.js');
const { LANGS, DEFAULT_SITE_URL } = require('./build.js');

const SRC = path.join(__dirname, '..', 'src');
const LOGO = fs.readFileSync(path.join(SRC, 'logo.svg'), 'utf8');
/* Шрифт названия, как в шапке сайта (встраивается в страницу-шаблон). */
const BRAND_FONT = ['latin', 'latin-ext', 'cyrillic']
  .map((sub) => {
    const data = fs.readFileSync(path.join(SRC, 'fonts', `onest-700-${sub}.woff2`)).toString('base64');
    return `@font-face { font-family: "Onest"; font-weight: 700; src: url(data:font/woff2;base64,${data}) format("woff2"); }`;
  })
  .join('\n');

const COLORS = {
  bg: '#fffdf7',
  ink: '#2b2115',
  soft: '#4d3f2c',
  muted: '#7a6a52',
  line: '#f1e4c4',
  accent: '#ff9f1c',
  accentInk: '#b35a00',
  accentSoft: '#fff2cc',
};

function ogHtml(t) {
  const c = COLORS;
  const host = DEFAULT_SITE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
  const rows = [
    ['72%', '48%'],
    ['40%', '27%'],
    ['22%', '15%'],
  ];
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
    ${BRAND_FONT}
    * { box-sizing: border-box; margin: 0; }
    body { width: 1200px; height: 630px; background: ${c.bg}; color: ${c.ink};
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; position: relative; overflow: hidden; }
    .glow { position: absolute; right: -160px; top: -200px; width: 640px; height: 640px; border-radius: 50%;
      background: radial-gradient(circle, ${c.accentSoft} 0%, transparent 70%); }
    .wrap { position: absolute; inset: 72px 80px; display: flex; flex-direction: column; }
    .brand { display: flex; align-items: center; gap: 18px; font: 700 32px Onest, system-ui, sans-serif; letter-spacing: -.015em; }
    .brand svg { width: 68px; height: 68px; }
    .kicker { margin-top: 54px; font-size: 22px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: ${c.accentInk}; }
    h1 { margin-top: 14px; font: 600 76px/1.04 "Iowan Old Style", "Palatino Linotype", Georgia, serif; letter-spacing: -.02em; max-width: 700px; }
    .bars { position: absolute; right: 0; top: 170px; width: 330px; padding: 26px; border: 2px solid ${c.line};
      border-radius: 22px; background: #fff; box-shadow: 0 20px 50px rgba(120, 80, 0, .12); }
    .row { display: grid; grid-template-columns: 1fr 52px; align-items: center; gap: 12px; margin: 12px 0; }
    .track { height: 16px; border-radius: 8px; background: ${c.accentSoft}; overflow: hidden; }
    .track i { display: block; height: 100%; border-radius: 8px; background: ${c.accent}; }
    .pct { font: 18px ui-monospace, Menlo, monospace; color: ${c.muted}; text-align: right; }
    .url { margin-top: auto; font: 22px ui-monospace, Menlo, monospace; color: ${c.muted}; }
  </style></head><body>
    <div class="glow"></div>
    <div class="wrap">
      <div class="brand">${LOGO}<span>${t('brand.name')}</span></div>
      <p class="kicker">${t('hero.kicker')}</p>
      <h1>${t('hero.title')}</h1>
      <div class="bars">${rows
        .map(([w, p]) => `<div class="row"><div class="track"><i style="width:${w}"></i></div><span class="pct">${p}</span></div>`)
        .join('')}</div>
      <p class="url">${host}</p>
    </div>
  </body></html>`;
}

function iconHtml(size, background) {
  const pad = Math.round(size * 0.14);
  return `<!DOCTYPE html><html><head><style>
    * { margin: 0; } body { width: ${size}px; height: ${size}px; background: ${background}; display: grid; place-items: center; }
    svg { width: ${size - pad * 2}px; height: ${size - pad * 2}px; }
  </style></head><body>${LOGO}</body></html>`;
}

async function shot(browser, html, width, height, file, transparent = false) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(html);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: file, omitBackground: transparent });
  await page.close();
  console.log('  ' + path.relative(path.join(__dirname, '..'), file));
}

(async () => {
  const locales = {};
  for (const code of LANGS) locales[code] = require(path.join(SRC, 'js', 'i18n', code + '.js'));

  fs.mkdirSync(path.join(SRC, 'og'), { recursive: true });
  const browser = await chromium.launch();
  for (const code of LANGS) {
    const { t } = i18n.createTranslator(locales, code);
    await shot(browser, ogHtml(t), 1200, 630, path.join(SRC, 'og', `og-${code}.png`));
  }
  await shot(browser, iconHtml(180, COLORS.bg), 180, 180, path.join(SRC, 'apple-touch-icon.png'));
  await shot(
    browser,
    `<!DOCTYPE html><html><head><style>*{margin:0}body{width:32px;height:32px;background:transparent}svg{width:32px;height:32px;display:block}</style></head><body>${LOGO}</body></html>`,
    32,
    32,
    path.join(SRC, 'favicon-32.png'),
    true
  );
  await browser.close();
})();
