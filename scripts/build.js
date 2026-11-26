#!/usr/bin/env node
'use strict';

/*
 * Сборка статического сайта в dist/ (без зависимостей).
 *
 *   node scripts/build.js                 → dist/ с адресом по умолчанию
 *   SITE_URL=https://example.org/x/ node scripts/build.js
 *
 * Для каждого языка создаётся отдельная страница с готовым переведённым текстом,
 * так поисковики видят контент на всех языках без выполнения JavaScript:
 *   dist/index.html      — английский (x-default)
 *   dist/ru/index.html   — русский
 *   dist/de/index.html   — немецкий
 * На каждой странице: canonical, hreflang для всех языков, Open Graph,
 * JSON-LD. Также создаются sitemap.xml и robots.txt.
 *
 * Перевод текста идёт через тот же переводчик, что и в браузере (src/js/i18n.js).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const DEFAULT_OUT = path.join(ROOT, 'dist');

const DEFAULT_SITE_URL = 'https://atdtn.github.io/llm-howto/';
const REPO_URL = 'https://github.com/atdtn/llm-howto';
/** Первый язык — основной; он же получает корень сайта и x-default. */
const LANGS = ['en', 'ru', 'de'];
const DEFAULT_LANG = LANGS[0];
const OG_LOCALE = { en: 'en_US', ru: 'ru_RU', de: 'de_DE' };
const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

const i18n = require(path.join(SRC, 'js', 'i18n.js'));

function normalizeSiteUrl(url) {
  return url.endsWith('/') ? url : url + '/';
}

/** Папка страницы языка относительно корня сайта: '' для основного, 'ru/' и т. д. */
function dirFor(code) {
  return code === DEFAULT_LANG ? '' : code + '/';
}

/** Относительная ссылка со страницы языка `from` на страницу языка `to`. */
function relHref(from, to) {
  const a = dirFor(from);
  const b = dirFor(to);
  if (a === b) return './';
  return (a ? '../' : '') + b;
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Значение атрибута name в строке атрибутов: заменить или добавить. */
function setAttr(attrs, name, value) {
  const re = new RegExp('\\s' + name + '="[^"]*"');
  const pair = ` ${name}="${value}"`;
  return re.test(attrs) ? attrs.replace(re, pair) : attrs + pair;
}

/**
 * Перевод разметки: элементы с data-i18n* получают готовый текст или атрибуты,
 * сами атрибуты data-i18n* из результата убираются.
 *   data-i18n="key"         — текст (экранируется)
 *   data-i18n-html="key"    — HTML (только собственные тексты)
 *   data-i18n-value="key"   — значение поля (у textarea — содержимое)
 *   data-i18n-attr="a:key;b:key" — атрибуты
 */
function translateMarkup(html, t) {
  const TAG = /<([a-zA-Z][\w-]*)([^>]*)>/g;
  let out = '';
  let last = 0;
  let match;

  while ((match = TAG.exec(html)) !== null) {
    const [whole, tag, attrs] = match;
    if (!/\sdata-i18n/.test(attrs)) continue;

    let newAttrs = attrs.replace(/\sdata-i18n[\w-]*="[^"]*"/g, '');
    let content = null;

    for (const [, kind, value] of attrs.matchAll(/\sdata-i18n(-html|-value|-attr)?="([^"]*)"/g)) {
      if (kind === '-attr') {
        for (const pair of value.split(';')) {
          const [name, key] = pair.split(':').map((part) => part.trim());
          if (name && key) newAttrs = setAttr(newAttrs, name, escapeHtml(t(key)));
        }
      } else if (kind === '-value') {
        if (tag === 'textarea') content = escapeHtml(t(value));
        else newAttrs = setAttr(newAttrs, 'value', escapeHtml(t(value)));
      } else if (kind === '-html') {
        content = t(value);
      } else {
        content = escapeHtml(t(value));
      }
    }

    out += html.slice(last, match.index) + '<' + tag + newAttrs + '>';
    last = TAG.lastIndex;

    if (content !== null && !VOID_TAGS.has(tag)) {
      const close = html.indexOf('</' + tag, last);
      if (close < 0) throw new Error(`build: no closing </${tag}> for ${whole}`);
      out += content;
      last = close;
      TAG.lastIndex = close;
    }
  }
  return out + html.slice(last);
}

function languageSwitcher(code, t) {
  const links = LANGS.map((other) => {
    const current = other === code;
    const cls = current ? ' class="is-current"' : '';
    const aria = current ? ' aria-current="true"' : '';
    const label = { en: 'English', ru: 'Русский', de: 'Deutsch' }[other];
    return `<a${cls} href="${relHref(code, other)}" hreflang="${other}" lang="${other}" data-lang-option="${other}"${aria}>${label}</a>`;
  });
  return `<nav class="lang-switch" aria-label="${escapeHtml(t('lang.label'))}">${links.join('')}</nav>`;
}

function jsonLd(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/** Всё, что нужно поисковикам и соцсетям: canonical, hreflang, Open Graph, JSON-LD. */
function seoHead(code, tr, siteUrl) {
  const url = siteUrl + dirFor(code);
  const title = tr.t('meta.title');
  const description = tr.t('meta.description');
  const alternates = LANGS.map(
    (lang) => `  <link rel="alternate" hreflang="${lang}" href="${siteUrl + dirFor(lang)}">`
  );
  alternates.push(`  <link rel="alternate" hreflang="x-default" href="${siteUrl}">`);

  const otherLocales = LANGS.filter((lang) => lang !== code).map(
    (lang) => `  <meta property="og:locale:alternate" content="${OG_LOCALE[lang]}">`
  );

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': siteUrl + '#website',
        url: siteUrl,
        name: title,
        inLanguage: LANGS,
        sameAs: [REPO_URL],
      },
      {
        '@type': 'WebPage',
        '@id': url + '#webpage',
        url,
        name: title,
        description,
        inLanguage: code,
        isPartOf: { '@id': siteUrl + '#website' },
      },
    ],
  };

  return [
    `  <link rel="canonical" href="${url}">`,
    ...alternates,
    `  <meta property="og:type" content="website">`,
    `  <meta property="og:site_name" content="${escapeHtml(title)}">`,
    `  <meta property="og:title" content="${escapeHtml(title)}">`,
    `  <meta property="og:description" content="${escapeHtml(description)}">`,
    `  <meta property="og:url" content="${url}">`,
    `  <meta property="og:locale" content="${OG_LOCALE[code]}">`,
    ...otherLocales,
    `  <meta name="twitter:card" content="summary">`,
    `  <script type="application/ld+json">${jsonLd(graph)}</script>`,
  ].join('\n');
}

/** Скрипты словарей: язык страницы и английский как запасной. */
function localeScripts(code, prefix) {
  const codes = code === DEFAULT_LANG ? [code] : [code, DEFAULT_LANG];
  return codes.map((c) => `  <script src="${prefix}js/i18n/${c}.js"></script>`).join('\n');
}

function renderPage(template, code, locales, siteUrl) {
  const tr = i18n.createTranslator(locales, code);
  const prefix = dirFor(code) ? '../' : '';

  let html = template;
  html = html.replace('<html lang="en">', `<html lang="${code}" data-lang="${code}">`);
  html = html.replace('href="styles.css"', `href="${prefix}styles.css"`);
  html = html.replace(/src="js\//g, `src="${prefix}js/`);
  html = html.replace('<!-- locale-scripts -->', localeScripts(code, prefix));
  html = html.replace('<!-- language-switcher -->', languageSwitcher(code, tr.t));
  html = translateMarkup(html, tr.t);
  html = html.replace('</head>', seoHead(code, tr, siteUrl) + '\n</head>');
  if (/\sdata-i18n/.test(html)) throw new Error('build: data-i18n attribute left in ' + code);
  return html;
}

function buildSitemap(siteUrl) {
  const urls = LANGS.map((code) => {
    const loc = siteUrl + dirFor(code);
    const alternates = LANGS.map(
      (lang) => `    <xhtml:link rel="alternate" hreflang="${lang}" href="${siteUrl + dirFor(lang)}"/>`
    );
    alternates.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}"/>`);
    return [`  <url>`, `    <loc>${loc}</loc>`, ...alternates, `  </url>`].join('\n');
  });
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}

function buildRobots(siteUrl) {
  return ['User-agent: *', 'Allow: /', '', `Sitemap: ${siteUrl}sitemap.xml`, ''].join('\n');
}

/** Копирует каталог, пропуская тесты (они не нужны на сайте). */
function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (entry.name === 'tests') continue;
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dst);
    else fs.copyFileSync(src, dst);
  }
}

function loadLocales() {
  const locales = {};
  for (const code of LANGS) {
    locales[code] = require(path.join(SRC, 'js', 'i18n', code + '.js'));
  }
  return locales;
}

/**
 * Собирает сайт в outDir. Возвращает список созданных страниц (относительные пути).
 * siteUrl — полный адрес сайта, нужен для canonical, hreflang и sitemap.
 */
function build({ outDir = DEFAULT_OUT, siteUrl = process.env.SITE_URL || DEFAULT_SITE_URL } = {}) {
  const site = normalizeSiteUrl(siteUrl);
  const template = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8');
  const locales = loadLocales();

  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });

  const pages = [];
  for (const code of LANGS) {
    const html = renderPage(template, code, locales, site);
    const rel = path.join(dirFor(code), 'index.html');
    fs.mkdirSync(path.join(outDir, dirFor(code)), { recursive: true });
    fs.writeFileSync(path.join(outDir, rel), html);
    pages.push(rel);
  }

  fs.copyFileSync(path.join(SRC, 'styles.css'), path.join(outDir, 'styles.css'));
  copyDir(path.join(SRC, 'js'), path.join(outDir, 'js'));
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), buildSitemap(site));
  fs.writeFileSync(path.join(outDir, 'robots.txt'), buildRobots(site));
  fs.writeFileSync(path.join(outDir, '.nojekyll'), '');

  return pages;
}

module.exports = { build, relHref, dirFor, translateMarkup, LANGS, DEFAULT_SITE_URL, REPO_URL };

if (require.main === module) {
  const pages = build();
  console.log('Built ' + pages.length + ' pages into ' + DEFAULT_OUT + ':');
  pages.forEach((page) => console.log('  ' + page));
}
