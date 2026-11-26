'use strict';

/* 03. Контекст: одно слово, два разных смысла. Тексты — в языковых словарях. */
(function () {
  window.Demos = window.Demos || {};

  window.Demos.context = {
    init() {
      const { locale } = window.LLM_I18N;
      const DATA = locale.data.contexts;
      const sentence = document.getElementById('context-sentence');
      const out = document.getElementById('context-out');
      const tabs = Array.from(document.querySelectorAll('[data-context]'));
      if (!sentence || !out || !tabs.length) return;

      const render = (key) => {
        const data = DATA[key];
        if (!data) return;

        sentence.textContent = '';
        const em = document.createElement('em');
        em.textContent = data.word;
        sentence.append(document.createTextNode(data.before), em, document.createTextNode(data.after));

        out.textContent = '';
        data.neighbors.forEach((word, i) => {
          const chip = document.createElement('span');
          chip.className = 'neighbor-chip';
          chip.textContent = word;
          chip.style.animationDelay = i * 45 + 'ms';
          out.appendChild(chip);
        });

        tabs.forEach((tab) => {
          const active = tab.dataset.context === key;
          tab.classList.toggle('is-active', active);
          tab.setAttribute('aria-selected', String(active));
        });
      };

      tabs.forEach((tab) => {
        tab.addEventListener('click', () => render(tab.dataset.context));
      });

      render('door');
    },
  };
})();
