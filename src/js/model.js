'use strict';

/*
 * Игрушечная языковая модель.
 *
 * Это не нейросеть: она просто считает, как часто после данной пары слов
 * встречалось каждое следующее слово во встроенном тексте (триграммы),
 * с откатом на пары (биграммы) и на отдельные слова (униграммы).
 * Принцип тот же, что у большой модели: распределение вероятностей
 * следующего токена. Масштаб — несопоставим.
 */
(function (global) {
  /* Буквы — любые (латиница с умлаутами и ß, кириллица, …), см. \p{L}. */
  const WORD_RE = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu;
  const DISPLAY_RE = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*|[^\s\p{L}\p{N}]/gu;

  /** Слова в нижнем регистре; пунктуация и пробелы отброшены. */
  function tokenize(text) {
    return String(text).toLowerCase().match(WORD_RE) || [];
  }

  /**
   * Кусочки для демо токенизации: слово целиком до 6 букв, длинное слово —
   * куски по 4 буквы, каждый знак препинания — отдельный кусочек.
   */
  function tokenizeForDisplay(text) {
    const chunks = String(text).match(DISPLAY_RE) || [];
    const out = [];
    for (const chunk of chunks) {
      if (chunk.length > 6) {
        for (let i = 0; i < chunk.length; i += 4) {
          out.push(chunk.slice(i, i + 4));
        }
      } else {
        out.push(chunk);
      }
    }
    return out;
  }

  /** Условный «номер» токена в словаре — устойчивый хеш, как id в настоящей модели. */
  function tokenId(token) {
    let h = 2166136261;
    for (let i = 0; i < token.length; i++) {
      h ^= token.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0) % 100000;
  }

  function inc(map, key) {
    map.set(key, (map.get(key) || 0) + 1);
  }

  /** Модель: частоты одиночных слов, пар и троек. */
  function buildModel(tokens) {
    const uni = new Map();
    const bi = new Map();
    const tri = new Map();
    for (let i = 0; i < tokens.length; i++) {
      inc(uni, tokens[i]);
      if (i >= 1) inc(bi, tokens[i - 1] + ' ' + tokens[i]);
      if (i >= 2) inc(tri, tokens[i - 2] + ' ' + tokens[i - 1] + ' ' + tokens[i]);
    }
    return { uni, bi, tri, total: tokens.length };
  }

  /**
   * Распределение слов, идущих после префикса.
   * Ключи карты имеют вид "префикс слово", поэтому выборка по startsWith.
   */
  function distributionFromCounts(counts, prefix) {
    let sum = 0;
    const out = [];
    for (const [key, count] of counts) {
      if (!key.startsWith(prefix)) continue;
      out.push({ token: key.slice(prefix.length), count });
      sum += count;
    }
    if (!sum) return [];
    return out
      .map((d) => ({ token: d.token, p: d.count / sum }))
      .sort((a, b) => b.p - a.p || a.token.localeCompare(b.token));
  }

  /**
   * Вероятности следующего слова: триграмма → биграмма → частоты слов.
   * Возвращает {items, source}, чтобы интерфейс мог честно сказать,
   * что контекст модели незнаком.
   */
  function predictNext(model, context) {
    const tokens = Array.isArray(context) ? context.map(String) : tokenize(context);
    if (!model || !model.total) return { items: [], source: 'none' };

    let items = [];
    let source = 'none';

    if (tokens.length >= 2) {
      const prefix = tokens.slice(-2).join(' ') + ' ';
      items = distributionFromCounts(model.tri, prefix);
      if (items.length) source = 'trigram';
    }
    if (!items.length && tokens.length >= 1) {
      const prefix = tokens[tokens.length - 1] + ' ';
      items = distributionFromCounts(model.bi, prefix);
      if (items.length) source = 'bigram';
    }
    if (!items.length) {
      items = distributionFromCounts(model.uni, '');
      if (items.length) source = 'unigram';
    }
    return { items, source };
  }

  /**
   * Температура: p → p^(1/T), затем перенормировка.
   * T < 1 обостряет распределение (осторожно), T > 1 сглаживает (смело).
   */
  function applyTemperature(items, temperature) {
    if (!items.length) return [];
    if (temperature <= 0.05) {
      return items.map((d, i) => ({ token: d.token, p: i === 0 ? 1 : 0 }));
    }
    const t = Math.max(0.01, temperature);
    const weights = items.map((d) => Math.pow(Math.max(d.p, 0), 1 / t));
    const sum = weights.reduce((a, b) => a + b, 0);
    return items.map((d, i) => ({ token: d.token, p: weights[i] / sum }));
  }

  /** Выбор токена по распределению; rng подменяется в тестах на сид. */
  function sample(items, rng) {
    const r = (rng || Math.random)();
    let acc = 0;
    for (const d of items) {
      acc += d.p;
      if (r < acc) return d.token;
    }
    return items[items.length - 1].token;
  }

  /**
   * Генерация по одному токену. Каждый шаг запоминается: распределение,
   * из которого выбирали, и выбранный токен.
   */
  function generate(model, prompt, options) {
    const opts = options || {};
    const temperature = opts.temperature == null ? 1 : opts.temperature;
    const maxTokens = opts.maxTokens == null ? 15 : opts.maxTokens;
    const rng = opts.rng || Math.random;

    const tokens = Array.isArray(prompt) ? prompt.slice() : tokenize(prompt);
    const steps = [];
    for (let i = 0; i < maxTokens; i++) {
      const { items } = predictNext(model, tokens);
      if (!items.length) break;
      const dist = applyTemperature(items, temperature);
      const token = sample(dist, rng);
      tokens.push(token);
      steps.push({ token, dist, contextLength: tokens.length - 1 });
    }
    return { tokens, steps };
  }

  /** Детерминированный генератор случайных чисел (mulberry32): одинаковое зерно — одинаковый ряд. */
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

  const api = {
    mulberry32,
    tokenize,
    tokenizeForDisplay,
    tokenId,
    buildModel,
    predictNext,
    applyTemperature,
    sample,
    generate,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    global.LLM = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
