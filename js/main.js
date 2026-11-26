'use strict';

/* Собираем игрушечную модель один раз и запускаем все демо. */
(function () {
  function boot() {
    const LLM = window.LLM;
    if (!LLM) {
      console.error('LLM не загрузилась: проверь js/model.js');
      return;
    }

    const model = LLM.buildModel(LLM.tokenize(window.CORPUS || ''));
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
