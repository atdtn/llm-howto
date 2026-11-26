'use strict';

/*
 * Условные «векторы смысла» для восьми слов и поиск ближайших соседей.
 * Два числа на слово — только для наглядности: у настоящей модели их сотни.
 */
(function (global) {
  const EMBEDDING_WORDS = [
    { id: 'kot', word: 'кот', vector: [0.7, 0.78] },
    { id: 'koshka', word: 'кошка', vector: [0.8, 0.68] },
    { id: 'pes', word: 'пёс', vector: [0.72, 0.3] },
    { id: 'sobaka', word: 'собака', vector: [0.6, 0.22] },
    { id: 'yabloko', word: 'яблоко', vector: [0.24, 0.74] },
    { id: 'grusha', word: 'груша', vector: [0.16, 0.66] },
    { id: 'apelsin', word: 'апельсин', vector: [0.3, 0.86] },
    { id: 'banan', word: 'банан', vector: [0.12, 0.54] },
  ];

  function checkVector(vector, name) {
    if (!Array.isArray(vector) || !vector.length) {
      throw new TypeError(name + ': вектор должен быть непустым массивом');
    }
    vector.forEach((x) => {
      if (typeof x !== 'number' || !Number.isFinite(x)) {
        throw new TypeError(name + ': координаты должны быть конечными числами');
      }
    });
  }

  function euclideanDistance(a, b) {
    checkVector(a, 'euclideanDistance');
    checkVector(b, 'euclideanDistance');
    if (a.length !== b.length) {
      throw new TypeError('euclideanDistance: векторы разной длины');
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
    if (!Array.isArray(words)) throw new TypeError('nearestWords: ожидается массив слов');
    const count = limit === undefined ? 3 : limit;
    if (!Number.isInteger(count) || count <= 0) {
      throw new TypeError('nearestWords: limit должен быть положительным целым');
    }

    const selected = words.find((w) => w && w.id === selectedId);
    if (!selected) throw new TypeError('nearestWords: неизвестный id ' + selectedId);
    checkVector(selected.vector, 'nearestWords');

    return words
      .filter((w) => w && w.id !== selectedId)
      .map((w) => {
        if (typeof w.id !== 'string' || typeof w.word !== 'string') {
          throw new TypeError('nearestWords: у слова нет id или word');
        }
        return {
          id: w.id,
          word: w.word,
          vector: w.vector.slice(),
          distance: euclideanDistance(selected.vector, w.vector),
        };
      })
      .sort((a, b) => a.distance - b.distance || a.word.localeCompare(b.word, 'ru'))
      .slice(0, count);
  }

  const api = { euclideanDistance, nearestWords, EMBEDDING_WORDS };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    global.LLMEmbeddings = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
