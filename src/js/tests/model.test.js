'use strict';

const test = require('node:test');
const assert = require('node:assert');
const {
  tokenize,
  tokenizeForDisplay,
  tokenId,
  buildModel,
  predictNext,
  applyTemperature,
  sample,
  generate,
} = require('../model.js');

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SMALL = 'дед бил бабу дед бил репку';

test('tokenize: нижний регистр, слова с дефисом целиком, пунктуация отброшена', () => {
  assert.deepStrictEqual(tokenize('Жил-был у бабушки. Козлик!'), ['жил-был', 'у', 'бабушки', 'козлик']);
});

test('tokenize: пустая строка даёт пустой массив', () => {
  assert.deepStrictEqual(tokenize('   '), []);
});

test('tokenizeForDisplay: слова и знаки препинания — отдельные кусочки', () => {
  assert.deepStrictEqual(tokenizeForDisplay('Привет, мир!'), ['Привет', ',', 'мир', '!']);
});

test('tokenizeForDisplay: длинное слово режется на куски не длиннее четырёх букв', () => {
  assert.deepStrictEqual(tokenizeForDisplay('языковых'), ['язык', 'овых']);
});

test('tokenId: одинаковый токен — одинаковый номер, разные — разные', () => {
  assert.strictEqual(tokenId('кот'), tokenId('кот'));
  assert.notStrictEqual(tokenId('кот'), tokenId('пёс'));
  assert.ok(Number.isInteger(tokenId('кот')));
  assert.ok(tokenId('кот') >= 0 && tokenId('кот') < 100000);
});

test('predictNext: триграмма даёт равные доли для двух продолжений', () => {
  const model = buildModel(tokenize(SMALL));
  const { items, source } = predictNext(model, 'дед бил');
  assert.strictEqual(source, 'trigram');
  assert.deepStrictEqual(items.map((i) => i.token).sort(), ['бабу', 'репку']);
  const sum = items.reduce((acc, i) => acc + i.p, 0);
  assert.ok(Math.abs(sum - 1) < 1e-9, `сумма вероятностей ${sum}`);
  items.forEach((i) => assert.ok(Math.abs(i.p - 0.5) < 1e-9));
});

test('predictNext: неизвестная пара падает до биграммы', () => {
  const model = buildModel(tokenize(SMALL));
  const { items, source } = predictNext(model, 'зебра бил');
  assert.strictEqual(source, 'bigram');
  assert.deepStrictEqual(items.map((i) => i.token).sort(), ['бабу', 'репку']);
});

test('predictNext: полностью неизвестный контекст падает до частот слов', () => {
  const model = buildModel(tokenize(SMALL));
  const { items, source } = predictNext(model, 'космос ракета');
  assert.strictEqual(source, 'unigram');
  assert.ok(items.length > 0);
  const sum = items.reduce((acc, i) => acc + i.p, 0);
  assert.ok(Math.abs(sum - 1) < 1e-9);
});

test('predictNext: пустая модель честно возвращает пустой список', () => {
  const model = buildModel([]);
  assert.deepStrictEqual(predictNext(model, 'что угодно'), { items: [], source: 'none' });
});

test('applyTemperature: почти нулевая температура оставляет только лучший вариант', () => {
  const dist = [
    { token: 'а', p: 0.5 },
    { token: 'б', p: 0.3 },
    { token: 'в', p: 0.2 },
  ];
  const cold = applyTemperature(dist, 0.01);
  assert.strictEqual(cold[0].p, 1);
  assert.strictEqual(cold[1].p, 0);
  assert.strictEqual(cold[2].p, 0);
});

test('applyTemperature: высокая температура выравнивает вероятности', () => {
  const dist = [
    { token: 'а', p: 0.7 },
    { token: 'б', p: 0.3 },
  ];
  const cool = applyTemperature(dist, 0.5);
  const hot = applyTemperature(dist, 2);
  assert.ok(cool[0].p > hot[0].p);
  const sum = hot.reduce((acc, i) => acc + i.p, 0);
  assert.ok(Math.abs(sum - 1) < 1e-9);
});

test('sample: значение генератора 0 берёт первый вариант, 0.99 — последний', () => {
  const dist = [
    { token: 'а', p: 0.6 },
    { token: 'б', p: 0.3 },
    { token: 'в', p: 0.1 },
  ];
  assert.strictEqual(sample(dist, () => 0), 'а');
  assert.strictEqual(sample(dist, () => 0.99), 'в');
});

test('generate: добавляет ровно maxTokens токенов и записывает шаги выбора', () => {
  const model = buildModel(tokenize(SMALL));
  const { tokens, steps } = generate(model, 'дед бил', {
    temperature: 1,
    maxTokens: 5,
    rng: mulberry32(7),
  });
  assert.strictEqual(tokens.length, 2 + 5);
  assert.strictEqual(tokens[0], 'дед');
  assert.strictEqual(tokens[1], 'бил');
  assert.strictEqual(steps.length, 5);
  steps.forEach((step) => {
    assert.ok(step.dist.some((d) => d.token === step.token));
  });
});

test('generate: одинаковый сид даёт одинаковый текст', () => {
  const model = buildModel(tokenize(SMALL));
  const run = () =>
    generate(model, 'дед бил', { temperature: 0.9, maxTokens: 8, rng: mulberry32(42) }).tokens;
  assert.deepStrictEqual(run(), run());
});

test('generate: maxTokens 0 возвращает только промпт и пустые шаги', () => {
  const model = buildModel(tokenize(SMALL));
  const { tokens, steps } = generate(model, 'дед бил', { maxTokens: 0 });
  assert.deepStrictEqual(tokens, ['дед', 'бил']);
  assert.deepStrictEqual(steps, []);
});

test('tokenize: буквы с умлаутами, ß и ё считаются частью слова', () => {
  assert.deepStrictEqual(tokenize('Schlüssel, Größe! Ёж'), ['schlüssel', 'größe', 'ёж']);
  assert.deepStrictEqual(tokenizeForDisplay('Straße!'), ['Straße', '!']);
});

const LLM = require("../model.js");

/* ---------- Демо на настоящих словарях: стартовые фразы не должны давать «один вариант». ---------- */

const fs = require('fs');
const path = require('path');
const DEMO_LOCALES = ['en', 'ru', 'de', 'sk'].map((code) => {
  const locale = require(`../i18n/${code}.js`);
  return { code, text: locale.text, model: LLM.buildModel(LLM.tokenize(locale.corpus)) };
});

test('демо 01: стартовая фраза даёт не меньше трёх вариантов в каждом языке', () => {
  for (const { code, text, model } of DEMO_LOCALES) {
    const { items } = LLM.predictNext(model, text['predict.defaultInput']);
    assert.ok(items.length >= 3, `${code}: «${text['predict.defaultInput']}» → ${items.length}`);
  }
});

test('демо 05: на первом шаге генерации есть из чего выбрать', () => {
  for (const { code, text, model } of DEMO_LOCALES) {
    const { items } = LLM.predictNext(model, text['generate.defaultInput']);
    assert.ok(items.length >= 2, `${code}: «${text['generate.defaultInput']}» → ${items.length}`);
  }
});

test('демо 06: примеры трёх колонок температуры различаются при любом положении ползунка', () => {
  const source = fs.readFileSync(path.join(__dirname, '..', 'demo', 'temperature.js'), 'utf8');
  const seed = Number(source.match(/const SEED = (\d+);/)[1]);
  const sample = (model, prompt, temperature, column) =>
    LLM.generate(model, prompt, { temperature, maxTokens: 4, rng: LLM.mulberry32(seed + column) }).tokens.join(' ');
  for (const { code, text, model } of DEMO_LOCALES) {
    const prompt = text['temperature.prompt'];
    const cold = sample(model, prompt, 0.2, 0);
    const hot = sample(model, prompt, 1.8, 2);
    assert.notStrictEqual(cold, hot, `${code}: 0,2 и 1,8`);
    for (let step = 5; step <= 15; step++) {
      const middle = sample(model, prompt, step / 10, 1);
      assert.notStrictEqual(middle, hot, `${code}: ${step / 10} и 1,8`);
      assert.notStrictEqual(middle, cold, `${code}: ${step / 10} и 0,2`);
    }
  }
});

test('mulberry32: одинаковое зерно — одинаковый ряд, числа в [0, 1)', () => {
  const a = LLM.mulberry32(42);
  const b = LLM.mulberry32(42);
  for (let i = 0; i < 5; i++) {
    const x = a();
    assert.strictEqual(x, b());
    assert.ok(x >= 0 && x < 1);
  }
});

test('готовые начала фраз: в 01 — от трёх вариантов, в 05 — от двух; примеры токенов на месте', () => {
  for (const { code, text } of DEMO_LOCALES) {
    const locale = require(`../i18n/${code}.js`);
    const model = DEMO_LOCALES.find((l) => l.code === code).model;
    const { predictStarts, generateStarts, tokenExamples } = locale.data;
    assert.ok(predictStarts.length >= 3 && generateStarts.length >= 3, `${code}: хотя бы три начала`);
    assert.strictEqual(predictStarts[0], text['predict.defaultInput'], `${code}: первое начало в 01 — фраза по умолчанию`);
    assert.strictEqual(generateStarts[0], text['generate.defaultInput'], `${code}: первое начало в 05 — фраза по умолчанию`);
    for (const start of predictStarts) {
      assert.ok(LLM.predictNext(model, start).items.length >= 3, `${code} 01: «${start}»`);
    }
    for (const start of generateStarts) {
      assert.ok(LLM.predictNext(model, start).items.length >= 2, `${code} 05: «${start}»`);
    }
    assert.strictEqual(tokenExamples.length, 5, `${code}: пять примеров текста`);
    assert.strictEqual(tokenExamples[0].text, text['tokens.defaultText'], `${code}: первый пример — текст по умолчанию`);
    tokenExamples.forEach((ex) => assert.ok(ex.label && LLM.tokenizeForDisplay(ex.text).length > 0, `${code}: «${ex.label}»`));
  }
});

test('е и ё: модель их не различает, а показывает слово как в тексте', () => {
  const model = LLM.buildModel(LLM.tokenize('Колобок ушёл от зайца. Колобок ушёл далеко.'));
  assert.strictEqual(LLM.matchKey('ушёл'), 'ушел');
  const typedWithE = LLM.predictNext(model, 'колобок ушел');
  assert.strictEqual(typedWithE.source, 'trigram');
  assert.deepStrictEqual(typedWithE.items.map((i) => i.token).sort(), ['далеко', 'от']);
  assert.deepStrictEqual(LLM.predictNext(model, 'колобок').items.map((i) => i.token), ['ушёл'], 'подсказка с «ё»');
});

test('е и ё: на настоящем русском тексте ввод без «ё» находит продолжение', () => {
  const ru = DEMO_LOCALES.find((l) => l.code === 'ru');
  assert.strictEqual(LLM.predictNext(ru.model, 'дедушки ушел').items[0].token, 'я');
  assert.strictEqual(LLM.predictNext(ru.model, 'я от дедушки').items[0].token, 'ушёл');
});
