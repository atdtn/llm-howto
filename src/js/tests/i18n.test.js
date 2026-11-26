'use strict';

const test = require('node:test');
const assert = require('node:assert');
const i18n = require('../i18n.js');
const en = require('../i18n/en.js');
const ru = require('../i18n/ru.js');
const de = require('../i18n/de.js');
const { EMBEDDING_WORDS } = require('../embeddings.js');
const { LEARNING_CANDIDATES } = require('../learn.js');

const LOCALES = { en, ru, de };

const placeholders = (text) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

test('словари: у всех языков одинаковый набор ключей', () => {
  const enKeys = Object.keys(en.text).sort();
  for (const code of ['ru', 'de']) {
    const keys = Object.keys(LOCALES[code].text).sort();
    assert.deepStrictEqual(keys, enKeys, `ключи языка ${code} расходятся с английским`);
  }
});

test('словари: плейсхолдеры {…} совпадают с английским в каждом ключе', () => {
  for (const key of Object.keys(en.text)) {
    const expected = placeholders(en.text[key]);
    for (const code of ['ru', 'de']) {
      assert.deepStrictEqual(placeholders(LOCALES[code].text[key]), expected, `${code}: ${key}`);
    }
  }
});

test('словари: ни один текст не пустой', () => {
  for (const [code, locale] of Object.entries(LOCALES)) {
    for (const [key, value] of Object.entries(locale.text)) {
      assert.ok(typeof value === 'string' && value.trim().length > 0, `${code}: ${key} пустой`);
    }
    assert.ok(locale.corpus.trim().length > 0, `${code}: корпус пустой`);
  }
});

test('словари: данные для демо согласованы с ядром', () => {
  for (const [code, locale] of Object.entries(LOCALES)) {
    const data = locale.data;

    assert.ok(data.contexts.door && data.contexts.music, `${code}: нет контекстов`);
    for (const ctx of Object.values(data.contexts)) {
      assert.ok(ctx.word && ctx.neighbors.length === 5, `${code}: контекст без слова или соседей`);
    }

    for (const word of EMBEDDING_WORDS) {
      assert.ok(data.embeddingLabels[word.id], `${code}: нет подписи для ${word.id}`);
    }

    for (const candidate of LEARNING_CANDIDATES) {
      assert.ok(data.learnLabels[candidate.id], `${code}: нет подписи для ${candidate.id}`);
    }

    assert.strictEqual(data.attentionWords.length, 7, `${code}: attentionWords должен быть из 7 слов`);
    assert.strictEqual(data.attentionNames.length, 7, `${code}: attentionNames должен быть из 7 слов`);
    data.attentionCommaAfter.forEach((i) => assert.ok(i >= 0 && i < 6));
    if (data.attentionSlots) {
      assert.strictEqual(data.attentionSlots.length, 7, `${code}: attentionSlots для каждого слова`);
      data.attentionSlots.forEach((s) => assert.ok(Number.isInteger(s) && s >= 0 && s < 7, `${code}: роль 0–6`));
    }
  }
});

test('interpolate: подставляет значения и оставляет неизвестные плейсхолдеры', () => {
  assert.strictEqual(i18n.interpolate('Всего: {count}', { count: 5 }), 'Всего: 5');
  assert.strictEqual(i18n.interpolate('{a} и {b}', { a: 1 }), '1 и {b}');
  assert.strictEqual(i18n.interpolate('без подстановок'), 'без подстановок');
});

test('createTranslator: переводит на выбранный язык', () => {
  const t = i18n.createTranslator(LOCALES, 'de');
  assert.strictEqual(t.code, 'de');
  assert.strictEqual(t.t('learn.answer'), de.text['learn.answer']);
});

test('createTranslator: пропущенный ключ берётся из английского, затем сам ключ', () => {
  const partial = { en: { ...en, text: { ...en.text, 'only.en': 'English only' } }, de };
  const t = i18n.createTranslator(partial, 'de');
  assert.strictEqual(t.t('only.en'), 'English only');
  assert.strictEqual(t.t('no.such.key'), 'no.such.key');
});

test('createTranslator: неизвестный язык — английский', () => {
  const t = i18n.createTranslator(LOCALES, 'fr');
  assert.strictEqual(t.code, 'en');
});

test('createTranslator: числа форматируются по правилам языка', () => {
  assert.strictEqual(i18n.createTranslator(LOCALES, 'en').num(0.25, 1), '0.3');
  assert.strictEqual(i18n.createTranslator(LOCALES, 'de').num(0.25, 1), '0,3');
  assert.strictEqual(i18n.createTranslator(LOCALES, 'ru').num(0.25, 1), '0,3');
});
