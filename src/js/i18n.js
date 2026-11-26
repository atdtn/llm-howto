'use strict';

/*
 * Переводчик для скриптов демо. Текст самой страницы уже переведён при сборке
 * (scripts/build.js), поэтому здесь нужны только строки, которые рисуют демо,
 * и корпус языка.
 *
 * Язык берётся из страницы: <html data-lang="ru"> ставит сборка.
 * Словари лежат в js/i18n/<код>.js и регистрируются в window.LLM_LOCALES.
 * Если ключа нет в языке, берётся английский; если нет и там — сам ключ.
 *
 * Чистые функции экспортируются для тестов в Node.
 * В браузере готовый переводчик доступен как window.LLM_I18N.
 */
(function (global) {
  const DEFAULT_LANG = 'en';
  const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

  /** Подстановка {name} из объекта vars; неизвестные имена остаются как есть. */
  function interpolate(text, vars) {
    if (!vars) return text;
    return text.replace(/\{(\w+)\}/g, (match, name) =>
      hasOwn(vars, name) ? String(vars[name]) : match
    );
  }

  function lookup(locale, key) {
    return locale && locale.text && hasOwn(locale.text, key) ? locale.text[key] : undefined;
  }

  /** Переводчик для одного языка. Неизвестный язык — английский. */
  function createTranslator(locales, code) {
    const fallback = locales[DEFAULT_LANG];
    const locale = locales[code] || fallback;

    const t = (key, vars) => {
      let text = lookup(locale, key);
      if (text === undefined) text = lookup(fallback, key);
      return text === undefined ? key : interpolate(text, vars);
    };

    /** Число по правилам языка: «0,2» в немецком и русском, «0.2» в английском. */
    const num = (value, digits = 0) =>
      new Intl.NumberFormat(locale.intl, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      }).format(value);

    return { code: locale.code, locale, t, num };
  }

  function boot() {
    const code = global.document.documentElement.dataset.lang || DEFAULT_LANG;
    global.LLM_I18N = createTranslator(global.LLM_LOCALES || {}, code);
  }

  const api = { DEFAULT_LANG, interpolate, createTranslator };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else if (global.document) {
    boot();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
