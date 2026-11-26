'use strict';

/*
 * Собираем игрушечную модель на тексте выбранного языка и запускаем все демо.
 * Текст (корпус) лежит в словаре языка: js/i18n/<код>.js.
 */
(function () {
  function boot() {
    const LLM = window.LLM;
    const i18n = window.LLM_I18N;
    if (!LLM) {
      console.error('LLM did not load: check js/model.js');
      return;
    }
    if (!i18n) {
      console.error('Translator did not load: check js/i18n.js');
      return;
    }

    const model = LLM.buildModel(LLM.tokenize(i18n.locale.corpus || ''));
    const demos = window.Demos || {};

    Object.keys(demos).forEach((name) => {
      const demo = demos[name];
      if (demo && typeof demo.init === 'function') {
        demo.init(model);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
