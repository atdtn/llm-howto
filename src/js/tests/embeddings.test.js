'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { euclideanDistance, nearestWords, EMBEDDING_WORDS } = require('../embeddings.js');

const FIXTURE = [
  { id: 'a', vector: [0, 0] },
  { id: 'b', vector: [0, 1] },
  { id: 'c', vector: [0, 1] },
  { id: 'd', vector: [0, 2] },
  { id: 'e', vector: [0, 5] },
];

test('euclideanDistance: треугольник 3-4-5', () => {
  assert.strictEqual(euclideanDistance([0, 0], [3, 4]), 5);
});

test('nearestWords: исключает выбранное слово и возвращает три ближайших', () => {
  const near = nearestWords(FIXTURE, 'a');
  assert.strictEqual(near.length, 3);
  assert.ok(near.every((n) => n.id !== 'a'));
  assert.deepStrictEqual(near.map((n) => n.id), ['b', 'c', 'd']);
  assert.deepStrictEqual(near.map((n) => n.distance), [1, 1, 2]);
});

test('nearestWords: равные расстояния сортируются по id', () => {
  const near = nearestWords(FIXTURE, 'a');
  assert.deepStrictEqual(near.map((n) => n.id), ['b', 'c', 'd']);
});

test('nearestWords: встроенный набор содержит восемь корректных слов', () => {
  const ids = new Set(EMBEDDING_WORDS.map((w) => w.id));
  assert.strictEqual(ids.size, 8);
  EMBEDDING_WORDS.forEach((w) => {
    assert.strictEqual(w.vector.length, 2);
    w.vector.forEach((x) => assert.ok(Number.isFinite(x)));
    assert.strictEqual(nearestWords(EMBEDDING_WORDS, w.id).length, 3);
  });
});

test('embeddings: некорректные векторы и неизвестный id отклоняются', () => {
  assert.throws(() => euclideanDistance([0, 0], [1]), TypeError);
  assert.throws(() => euclideanDistance([0, NaN], [1, 2]), TypeError);
  assert.throws(() => nearestWords(FIXTURE, 'nope'), TypeError);
});
