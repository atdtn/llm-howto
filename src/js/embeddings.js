'use strict';

/*
 * Условные «векторы смысла» для восьми слов и поиск ближайших соседей.
 * Два числа на слово — только для наглядности: у настоящей модели их сотни.
 */
(function (global) {
  /* Только идентификаторы и координаты; подписи слов — в языковых словарях. */
  const EMBEDDING_WORDS = [
    { id: 'kot', vector: [0.7, 0.78] },
    { id: 'koshka', vector: [0.8, 0.68] },
    { id: 'pes', vector: [0.72, 0.3] },
    { id: 'sobaka', vector: [0.6, 0.22] },
    { id: 'yabloko', vector: [0.24, 0.74] },
    { id: 'grusha', vector: [0.16, 0.66] },
    { id: 'apelsin', vector: [0.3, 0.86] },
    { id: 'banan', vector: [0.12, 0.54] },
  ];

  function checkVector(vector, name) {
    if (!Array.isArray(vector) || !vector.length) {
      throw new TypeError(name + ': vector must be a non-empty array');
    }
    vector.forEach((x) => {
      if (typeof x !== 'number' || !Number.isFinite(x)) {
        throw new TypeError(name + ': coordinates must be finite numbers');
      }
    });
  }

  function euclideanDistance(a, b) {
    checkVector(a, 'euclideanDistance');
    checkVector(b, 'euclideanDistance');
    if (a.length !== b.length) {
      throw new TypeError('euclideanDistance: vectors have different lengths');
    }
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      const d = a[i] - b[i];
      sum += d * d;
    }
    return Math.sqrt(sum);
  }

  /** Ближайшие слова к выбранному: новые объекты, исходный массив не меняется. */
  function nearestWords(words, selectedId, limit) {
    if (!Array.isArray(words)) throw new TypeError('nearestWords: expected an array of words');
    const count = limit === undefined ? 3 : limit;
    if (!Number.isInteger(count) || count <= 0) {
      throw new TypeError('nearestWords: limit must be a positive integer');
    }

    const selected = words.find((w) => w && w.id === selectedId);
    if (!selected) throw new TypeError('nearestWords: unknown id ' + selectedId);
    checkVector(selected.vector, 'nearestWords');

    return words
      .filter((w) => w && w.id !== selectedId)
      .map((w) => {
        if (typeof w.id !== 'string') {
          throw new TypeError('nearestWords: word has no id');
        }
        return {
          id: w.id,
          vector: w.vector.slice(),
          distance: euclideanDistance(selected.vector, w.vector),
        };
      })
      .sort((a, b) => a.distance - b.distance || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
      .slice(0, count);
  }

  const api = { euclideanDistance, nearestWords, EMBEDDING_WORDS };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    global.LLMEmbeddings = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
