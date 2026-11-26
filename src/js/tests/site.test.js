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
