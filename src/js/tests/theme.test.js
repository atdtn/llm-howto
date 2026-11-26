'use strict';

const test = require('node:test');
const assert = require('node:assert');
const theme = require('../theme.js');

const { effectiveTheme, readStored, readPalette, apply, normalizeMode, normalizePalette } = theme;

test('effectiveTheme: явный выбор важнее системной темы', () => {
  assert.strictEqual(effectiveTheme({ dataset: { theme: 'light' } }, true), 'light');
  assert.strictEqual(effectiveTheme({ dataset: { theme: 'dark' } }, false), 'dark');
});

test('effectiveTheme: без выбора берётся системная тема', () => {
  assert.strictEqual(effectiveTheme({ dataset: {} }, true), 'dark');
  assert.strictEqual(effectiveTheme({ dataset: {} }, false), 'light');
});

test('readStored: принимает только light и dark, сбой хранилища даёт null', () => {
  const storage = (value) => ({ getItem: () => value });
  assert.strictEqual(readStored(storage('dark')), 'dark');
  assert.strictEqual(readStored(storage('light')), 'light');
  assert.strictEqual(readStored(storage('blue')), null);
  assert.strictEqual(readStored(storage(null)), null);
  assert.strictEqual(readStored({ getItem: () => { throw new Error('denied'); } }), null);
  assert.strictEqual(theme.STORAGE_KEY, 'llm-howto.theme');
});

test('readPalette: неизвестная палитра и сбой хранилища дают палитру по умолчанию', () => {
  assert.strictEqual(readPalette({ getItem: () => 'sage' }), 'sage');
  assert.strictEqual(readPalette({ getItem: () => 'pink' }), 'amber');
  assert.strictEqual(readPalette({ getItem: () => { throw new Error('denied'); } }), 'amber');
  assert.strictEqual(theme.PALETTE_KEY, 'llm-howto.palette');
});

test('normalize: неизвестные значения — авто и палитра по умолчанию', () => {
  assert.strictEqual(normalizeMode('dark'), 'dark');
  assert.strictEqual(normalizeMode(undefined), 'auto');
  assert.strictEqual(normalizePalette('coral'), 'coral');
  assert.strictEqual(normalizePalette(''), 'amber');
});

test('apply: ставит и убирает атрибуты на <html>', () => {
  const root = { dataset: {} };
  apply(root, 'dark', 'indigo');
  assert.deepStrictEqual({ ...root.dataset }, { theme: 'dark', palette: 'indigo' });
  apply(root, 'auto', 'amber');
  assert.deepStrictEqual({ ...root.dataset }, {});
});
