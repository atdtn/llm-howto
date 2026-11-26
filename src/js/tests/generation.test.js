'use strict';

const test = require('node:test');
const assert = require('node:assert');
const { createPlaybackState, transitionPlayback } = require('../generation.js');

test('createPlaybackState: начальное состояние idle', () => {
  assert.deepStrictEqual(createPlaybackState(), { mode: 'idle', remaining: 0 });
});

test('transitionPlayback: start и десять шагов завершают серию', () => {
  let s = transitionPlayback(createPlaybackState(), { type: 'start', count: 10 });
  assert.deepStrictEqual(s, { mode: 'auto', remaining: 10 });

  for (let i = 9; i > 0; i--) {
    s = transitionPlayback(s, { type: 'step' });
    assert.deepStrictEqual(s, { mode: 'auto', remaining: i });
  }
  s = transitionPlayback(s, { type: 'step' });
  assert.deepStrictEqual(s, { mode: 'idle', remaining: 0 });
});

test('transitionPlayback: пауза сохраняет остаток и блокирует step', () => {
  let s = { mode: 'auto', remaining: 7 };
  s = transitionPlayback(s, { type: 'pause' });
  assert.deepStrictEqual(s, { mode: 'paused', remaining: 7 });
  assert.deepStrictEqual(transitionPlayback(s, { type: 'step' }), s);
});

test('transitionPlayback: продолжение возвращает auto с тем же остатком', () => {
  const s = transitionPlayback({ mode: 'paused', remaining: 4 }, { type: 'resume' });
  assert.deepStrictEqual(s, { mode: 'auto', remaining: 4 });
});

test('transitionPlayback: сброс отменяет auto и paused', () => {
  assert.deepStrictEqual(transitionPlayback({ mode: 'auto', remaining: 5 }, { type: 'reset' }), {
    mode: 'idle',
    remaining: 0,
  });
  assert.deepStrictEqual(transitionPlayback({ mode: 'paused', remaining: 5 }, { type: 'reset' }), {
    mode: 'idle',
    remaining: 0,
  });
});

test('transitionPlayback: новый start заменяет прежнюю серию', () => {
  const s = transitionPlayback({ mode: 'paused', remaining: 7 }, { type: 'start', count: 10 });
  assert.deepStrictEqual(s, { mode: 'auto', remaining: 10 });
});

test('transitionPlayback: посторонние события и неверный count отклоняются', () => {
  const s = createPlaybackState();
  assert.throws(() => transitionPlayback(s, { type: 'прыжок' }), TypeError);
  assert.throws(() => transitionPlayback(s, { type: 'start', count: 0 }), TypeError);
  assert.throws(() => transitionPlayback(s, { type: 'start', count: -3 }), TypeError);
  assert.throws(() => transitionPlayback(s, { type: 'start', count: 2.5 }), TypeError);
  assert.deepStrictEqual(transitionPlayback(s, { type: 'step' }), s);
});
