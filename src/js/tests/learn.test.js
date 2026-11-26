'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { softmax, trainingDistribution, LEARNING_MAX_STEP, LEARNING_CANDIDATES } = require('../learn.js');

const EPS = 1e-12;

test('softmax: сумма вероятностей равна 1', () => {
  const p = softmax([0, Math.log(2), 0]);
  assert.ok(Math.abs(p[0] - 0.25) < 1e-9);
  assert.ok(Math.abs(p[1] - 0.5) < 1e-9);
  assert.ok(Math.abs(p[2] - 0.25) < 1e-9);
  assert.ok(Math.abs(p.reduce((a, b) => a + b, 0) - 1) < EPS);
});

test('softmax: большие оценки не дают Infinity или NaN', () => {
  const p = softmax([10000, 10001]);
  p.forEach((x) => assert.ok(Number.isFinite(x)));
  assert.ok(Math.abs(p.reduce((a, b) => a + b, 0) - 1) < EPS);
  assert.ok(p[1] > p[0]);
});

test('softmax: пустой вход и некорректные оценки', () => {
  assert.deepStrictEqual(softmax([]), []);
  assert.throws(() => softmax([NaN, 1]), TypeError);
  assert.throws(() => softmax([Infinity, 1]), TypeError);
});

test('trainingDistribution: в начале Париж (paris) наименее вероятен', () => {
  const dist = trainingDistribution(0);
  assert.strictEqual(dist.length, LEARNING_CANDIDATES.length);
  const sum = dist.reduce((acc, d) => acc + d.p, 0);
  assert.ok(Math.abs(sum - 1) < EPS);
  const paris = dist.find((d) => d.id === 'paris');
  assert.ok(paris.p < 0.1);
  dist.forEach((d) => {
    if (d.id !== 'paris') assert.ok(d.p > paris.p);
  });
});

test('trainingDistribution: в конце Париж доминирует', () => {
  const dist = trainingDistribution(LEARNING_MAX_STEP);
  const paris = dist.find((d) => d.id === 'paris');
  assert.ok(paris.p > 0.95);
  const max = Math.max(...dist.map((d) => d.p));
  assert.strictEqual(paris.p, max);
});

test('trainingDistribution: вероятность Парижа растёт, шаг ограничен диапазоном', () => {
  const p = (step) => trainingDistribution(step).find((d) => d.id === 'paris').p;
  const steps = [0, 25, 50, 75, 100].map(p);
  for (let i = 1; i < steps.length; i++) assert.ok(steps[i] > steps[i - 1]);

  assert.deepStrictEqual(trainingDistribution(-10), trainingDistribution(0));
  assert.deepStrictEqual(trainingDistribution(110), trainingDistribution(100));
  assert.throws(() => trainingDistribution(NaN), TypeError);
});
