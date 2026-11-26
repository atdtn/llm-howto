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
