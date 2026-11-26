'use strict';

const { test } = require('node:test');
const assert = require('node:assert');
const { activeIndex, readProgress, withHash } = require('../nav.js');

test('activeIndex: последний раздел, чей верх выше линии', () => {
  const tops = [100, 500, 900];
  assert.strictEqual(activeIndex(tops, 50), -1);
  assert.strictEqual(activeIndex(tops, 100), 0);
  assert.strictEqual(activeIndex(tops, 499), 0);
  assert.strictEqual(activeIndex(tops, 650), 1);
  assert.strictEqual(activeIndex(tops, 5000), 2);
  assert.strictEqual(activeIndex([], 100), -1);
});

test('readProgress: от 0 до 1, короткая страница — 1', () => {
  assert.strictEqual(readProgress(0, 2000, 1000), 0);
  assert.strictEqual(readProgress(500, 2000, 1000), 0.5);
  assert.strictEqual(readProgress(5000, 2000, 1000), 1);
  assert.strictEqual(readProgress(-20, 2000, 1000), 0);
  assert.strictEqual(readProgress(0, 800, 1000), 1);
});

test('withHash: переход на другой язык сохраняет раздел', () => {
  assert.strictEqual(withHash('../de/', '#tokens'), '../de/#tokens');
  assert.strictEqual(withHash('../de/#old', '#tokens'), '../de/#tokens');
  assert.strictEqual(withHash('./', ''), './');
  assert.strictEqual(withHash('ru/', '#top'), 'ru/');
});
