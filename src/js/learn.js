'use strict';

/*
 * Иллюстрация обучения: как подстройка чисел меняет вероятности.
 * Это не настоящий градиентный спуск, а подобранный пример.
 */
(function (global) {
  const LEARNING_MAX_STEP = 100;

  /*
   * «Оценки» кандидатов: start — в начале обучения, end — в конце.
   * Подписи слов берутся из языкового словаря; здесь только идентификаторы.
   * Париж (ANSWER_ID) стартует ниже всех и за 100 шагов становится явным лидером.
   */
  const ANSWER_ID = 'paris';
  const LEARNING_CANDIDATES = [
    { id: 'paris', start: 0, end: 5 },
    { id: 'london', start: 2, end: 0.5 },
    { id: 'berlin', start: 1.5, end: 0 },
    { id: 'madrid', start: 1, end: 0 },
    { id: 'rome', start: 0.5, end: 0 },
  ];

  /** Оценки → вероятности. Вычитание максимума защищает от Infinity. */
  function softmax(logits) {
    if (!Array.isArray(logits)) throw new TypeError('softmax: expected an array');
    if (!logits.length) return [];
    logits.forEach((x) => {
      if (typeof x !== 'number' || !Number.isFinite(x)) {
        throw new TypeError('softmax: scores must be finite numbers');
      }
    });
    const max = Math.max(...logits);
    const exps = logits.map((x) => Math.exp(x - max));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map((e) => e / sum);
  }

  /** Вероятности кандидатов на данном шаге обучения (0…100). */
  function trainingDistribution(step) {
    if (typeof step !== 'number' || !Number.isFinite(step)) {
      throw new TypeError('trainingDistribution: step must be a number');
    }
    const s = Math.min(LEARNING_MAX_STEP, Math.max(0, step));
    const logits = LEARNING_CANDIDATES.map(
      (c) => c.start + ((c.end - c.start) * s) / LEARNING_MAX_STEP
    );
    const probs = softmax(logits);
    return LEARNING_CANDIDATES.map((c, i) => ({ id: c.id, p: probs[i] }));
  }

  const api = { softmax, trainingDistribution, LEARNING_MAX_STEP, LEARNING_CANDIDATES, ANSWER_ID };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    global.LLMLearn = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
