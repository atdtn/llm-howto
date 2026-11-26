'use strict';

const { test, after } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { build, relHref, translateMarkup, LANGS } = require('../../../scripts/build.js');
const { createTranslator } = require('../i18n.js');
const en = require('../i18n/en.js');
const ru = require('../i18n/ru.js');
const de = require('../i18n/de.js');

const SITE = 'https://example.org/llm-howto/';
const LOCALES = { en, ru, de };

/* Сборка один раз на все тесты: она создаёт каталог во временной папке. */
const OUT = fs.mkdtempSync(path.join(os.tmpdir(), 'llm-howto-site-'));
build({ outDir: OUT, siteUrl: SITE });
after(() => fs.rmSync(OUT, { recursive: true, force: true }));
const read = (rel) => fs.readFileSync(path.join(OUT, rel), 'utf8');

test('сборка: страница на каждом языке, корень — английский', () => {
  assert.ok(fs.existsSync(path.join(OUT, 'index.html')));
  assert.ok(fs.existsSync(path.join(OUT, 'ru', 'index.html')));
  assert.ok(fs.existsSync(path.join(OUT, 'de', 'index.html')));
  assert.ok(fs.existsSync(path.join(OUT, 'sitemap.xml')));
  assert.ok(fs.existsSync(path.join(OUT, 'robots.txt')));
  assert.ok(fs.existsSync(path.join(OUT, 'styles.css')));
  assert.ok(fs.existsSync(path.join(OUT, 'js', 'main.js')));
  assert.ok(!fs.existsSync(path.join(OUT, 'js', 'tests')), 'тесты не должны попадать на сайт');
});

test('страницы: язык, заголовок и описание переведены в HTML', () => {
  const expected = { en: 'index.html', ru: 'ru/index.html', de: 'de/index.html' };
  for (const code of LANGS) {
    const html = read(expected[code]);
    const t = createTranslator(LOCALES, code).t;
    assert.match(html, new RegExp(`<html lang="${code}" data-lang="${code}">`));
    assert.ok(html.includes(`<title>${t('meta.title')}</title>`), `${code}: заголовок`);
    assert.ok(html.includes(`content="${t('meta.description')}"`), `${code}: описание`);
    assert.ok(html.includes(t('hero.lead').slice(0, 30)), `${code}: текст героя`);
    assert.ok(!/\sdata-i18n/.test(html), `${code}: остались data-i18n атрибуты`);
    assert.ok(!/\{\w+\}/.test(html), `${code}: остались плейсхолдеры`);
    assert.strictEqual((html.match(/<h1[\s>]/g) || []).length, 1, `${code}: один h1`);
  }
});

test('страницы: canonical, hreflang для всех языков и x-default', () => {
  const pages = { en: '', ru: 'ru/', de: 'de/' };
  for (const code of LANGS) {
    const html = read(path.join(pages[code], 'index.html'));
    assert.ok(html.includes(`<link rel="canonical" href="${SITE}${pages[code]}">`), `${code}: canonical`);
    for (const other of LANGS) {
      assert.ok(
        html.includes(`<link rel="alternate" hreflang="${other}" href="${SITE}${pages[other]}">`),
        `${code}: hreflang ${other}`
      );
    }
    assert.ok(html.includes(`<link rel="alternate" hreflang="x-default" href="${SITE}">`), `${code}: x-default`);
  }
});

test('страницы: Open Graph и JSON-LD с языком страницы', () => {
  const html = read('ru/index.html');
  assert.ok(html.includes('<meta property="og:locale" content="ru_RU">'));
  assert.ok(html.includes('<meta property="og:locale:alternate" content="en_US">'));
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  assert.ok(match, 'JSON-LD есть');
  const graph = JSON.parse(match[1])['@graph'];
  const page = graph.find((node) => node['@type'] === 'WebPage');
  assert.strictEqual(page.inLanguage, 'ru');
  assert.strictEqual(page.url, SITE + 'ru/');
});

test('страницы: переключатель языка ведёт на другие страницы и отмечает текущий', () => {
  const ru = read('ru/index.html');
  assert.match(ru, /<a class="is-current" href="\.\/" hreflang="ru"[^>]*data-lang-option="ru" aria-current="true">/);
  assert.match(ru, /<a href="\.\.\/" hreflang="en"/);
  assert.match(ru, /<a href="\.\.\/de\/" hreflang="de"/);

  const en = read('index.html');
  assert.match(en, /<a href="ru\/" hreflang="ru"/);
  assert.match(en, /<a href="de\/" hreflang="de"/);
});

test('страницы: логотип, иконка сайта и переключатель темы', () => {
  for (const [rel, prefix] of [['index.html', ''], ['ru/index.html', '../'], ['de/index.html', '../']]) {
    const html = read(rel);
    assert.match(html, /<svg class="brand-mark" role="img" aria-label="[^"]+"/, `${rel}: логотип`);
    assert.ok(html.includes(`<link rel="icon" href="${prefix}logo.svg" type="image/svg+xml">`), `${rel}: иконка`);
    assert.ok(html.includes('id="settings-toggle"'), `${rel}: кнопка настроек`);
    assert.strictEqual((html.match(/name="theme-palette"/g) || []).length, 5, `${rel}: пять палитр`);
    assert.ok(html.includes("localStorage.getItem('llm-howto.palette')"), `${rel}: палитра до отрисовки`);
    assert.ok(html.includes(`<link rel="apple-touch-icon" href="${prefix}apple-touch-icon.png">`), `${rel}: значок iOS`);
    assert.ok(html.includes('<meta name="theme-color"'), `${rel}: цвет строки браузера`);
    assert.ok(html.includes(`src="${prefix}js/theme.js"`), `${rel}: скрипт темы`);
    assert.ok(html.includes("localStorage.getItem('llm-howto.theme')"), `${rel}: тема до отрисовки`);
  }
  assert.ok(fs.existsSync(path.join(OUT, 'logo.svg')));
});

test('страницы: пути к стилям и скриптам ведут к корню сайта', () => {
  const ru = read('ru/index.html');
  assert.ok(ru.includes('href="../styles.css"'));
  assert.ok(ru.includes('src="../js/i18n/ru.js"'));
  assert.ok(ru.includes('src="../js/i18n/en.js"'), 'запасной английский словарь');
  const en = read('index.html');
  assert.ok(en.includes('href="styles.css"'));
  assert.ok(!en.includes('js/i18n/de.js'), 'английская страница не грузит чужие словари');
});

test('sitemap: все языковые страницы с альтернативами', () => {
  const xml = read('sitemap.xml');
  for (const loc of [SITE, SITE + 'ru/', SITE + 'de/']) {
    assert.ok(xml.includes(`<loc>${loc}</loc>`), 'в sitemap есть ' + loc);
  }
  assert.strictEqual((xml.match(/hreflang="x-default"/g) || []).length, 3);
});

test('robots.txt: разрешает всё и указывает sitemap', () => {
  assert.ok(read('robots.txt').includes(`Sitemap: ${SITE}sitemap.xml`));
});

test('relHref: относительные ссылки между языковыми папками', () => {
  assert.strictEqual(relHref('en', 'en'), './');
  assert.strictEqual(relHref('en', 'ru'), 'ru/');
  assert.strictEqual(relHref('ru', 'en'), '../');
  assert.strictEqual(relHref('ru', 'de'), '../de/');
  assert.strictEqual(relHref('de', 'de'), './');
});

test('translateMarkup: текст экранируется, атрибуты заменяются, data-атрибуты убираются', () => {
  const t = (key) => (key === 'k' ? 'a < b & "c"' : key === 'h' ? '<br>x' : 'v');
  const html = '<p data-i18n="k">old</p><b data-i18n-html="h">old</b><input value="x" data-i18n-value="v"><div data-i18n-attr="aria-label:k;title:v"></div>';
  const out = translateMarkup(html, t);
  assert.strictEqual(
    out,
    '<p>a &lt; b &amp; &quot;c&quot;</p><b><br>x</b><input value="v"><div aria-label="a &lt; b &amp; &quot;c&quot;" title="v"></div>'
  );
});

test('translateMarkup: ошибка, если закрывающий тег не найден', () => {
  assert.throws(() => translateMarkup('<p data-i18n="k">no close', () => 'x'), /no closing/);
});

test('страницы: шапка с меню разделов, меню языков и скриптом навигации', () => {
  const pages = { en: '', ru: 'ru/', de: 'de/' };
  for (const code of LANGS) {
    const prefix = pages[code] ? '../' : '';
    const html = read(path.join(pages[code], 'index.html'));
    assert.ok(html.includes('id="toc-toggle"'), `${code}: кнопка меню`);
    assert.ok(html.includes('aria-controls="toc"'), `${code}: кнопка связана с меню`);
    assert.strictEqual((html.match(/<a href="#[a-z]+"><span class="toc-num">/g) || []).length, 9, `${code}: девять разделов`);
    assert.ok(/<details class="lang-menu">/.test(html), `${code}: меню языков`);
    assert.ok(html.includes(`<span class="lang-code">${code.toUpperCase()}</span>`), `${code}: код языка`);
    assert.ok(html.includes(`src="${prefix}js/nav.js"`), `${code}: скрипт меню`);
    assert.strictEqual((html.match(/<header[\s>]/g) || []).length, 1, `${code}: одна шапка (banner)`);
  }
});

test('страницы: картинка для соцсетей на языке страницы', () => {
  const pages = { en: '', ru: 'ru/', de: 'de/' };
  for (const code of LANGS) {
    const html = read(path.join(pages[code], 'index.html'));
    const image = `${SITE}og/og-${code}.png`;
    assert.ok(html.includes(`<meta property="og:image" content="${image}">`), `${code}: og:image`);
    assert.ok(html.includes(`<meta name="twitter:image" content="${image}">`), `${code}: twitter:image`);
    assert.ok(html.includes('<meta name="twitter:card" content="summary_large_image">'), `${code}: большая карточка`);
    assert.ok(fs.existsSync(path.join(OUT, 'og', `og-${code}.png`)), `${code}: файл картинки`);
  }
  assert.ok(fs.existsSync(path.join(OUT, 'apple-touch-icon.png')));
  assert.ok(fs.existsSync(path.join(OUT, 'favicon-32.png')));
  for (const sub of ['latin', 'latin-ext', 'cyrillic']) {
    assert.ok(fs.existsSync(path.join(OUT, 'fonts', `onest-700-${sub}.woff2`)), `шрифт ${sub}`);
  }
});

test('палитры: одинаковый список в theme.js, styles.css и скрипте в <head>', () => {
  const { PALETTES } = require('../theme.js');
  const css = fs.readFileSync(path.join(__dirname, '..', '..', 'styles.css'), 'utf8');
  const head = fs.readFileSync(path.join(__dirname, '..', '..', 'index.html'), 'utf8');
  for (const name of PALETTES) {
    assert.ok(css.includes(`:root[data-palette="${name}"]`), `styles.css: ${name}`);
    assert.ok(head.includes(`value="${name}"`), `index.html: вариант ${name}`);
  }
  const headList = head.match(/\^\(([a-z|]+)\)\$/)[1].split('|');
  assert.deepStrictEqual(headList, PALETTES);
});

