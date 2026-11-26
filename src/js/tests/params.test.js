'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { estimateParameters, PRESETS, VOCAB_SIZE } = require('../params.js');

test('estimateParameters: известная маленькая конфигурация', () => {
  const r = estimateParameters(12, 768);
  assert.strictEqual(r.parameters, 161734656);
  assert.strictEqual(r.fp16Bytes, 323469312);
  assert.ok(Math.abs(r.fp16GB - 0.323469312) < 1e-12);
});

test('estimateParameters: средняя и большая конфигурации', () => {
  assert.strictEqual(estimateParameters(32, 4096).parameters, 6852050944);
  assert.strictEqual(estimateParameters(80, 8192).parameters, 65243709440);
});

test('estimateParameters: размер fp16 равен двум байтам на параметр', () => {
  [[12, 768], [32, 4096], [4, 512], [96, 8192]].forEach(([l, d]) => {
    const r = estimateParameters(l, d);
    assert.strictEqual(r.fp16Bytes, r.parameters * 2);
    assert.strictEqual(r.parameters, 12 * l * d * d + 2 * VOCAB_SIZE * d);
  });
});

test('estimateParameters и PRESETS: диапазоны и некорректные входы', () => {
  assert.deepStrictEqual(PRESETS.small, { layers: 12, width: 768 });
  assert.deepStrictEqual(PRESETS.medium, { layers: 32, width: 4096 });
  assert.deepStrictEqual(PRESETS.large, { layers: 80, width: 8192 });

  Object.values(PRESETS).forEach((p) => {
    assert.ok(p.layers >= 4 && p.layers <= 96);
    assert.ok(p.width >= 512 && p.width <= 8192);
  });

  assert.throws(() => estimateParameters(0, 4096), TypeError);
  assert.throws(() => estimateParameters(-4, 4096), TypeError);
  assert.throws(() => estimateParameters(32, 0), TypeError);
  assert.throws(() => estimateParameters(32.5, 4096), TypeError);
  assert.throws(() => estimateParameters('32', 4096), TypeError);
  assert.throws(() => estimateParameters(32, NaN), TypeError);
});
