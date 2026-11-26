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

        /* Вкладки по правилам ARIA: в порядке Tab только активная, остальные — стрелками. */
        tabs.forEach((tab) => {
          const active = tab.dataset.context === key;
          tab.classList.toggle('is-active', active);
          tab.setAttribute('aria-selected', String(active));
          tab.tabIndex = active ? 0 : -1;
          if (active && panel) panel.setAttribute('aria-labelledby', tab.id);
        });
      };

      const panel = document.getElementById('context-panel');

      tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => render(tab.dataset.context));
        tab.addEventListener('keydown', (event) => {
          const moves = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
          let next = null;
          if (event.key in moves) next = (index + moves[event.key] + tabs.length) % tabs.length;
          else if (event.key === 'Home') next = 0;
          else if (event.key === 'End') next = tabs.length - 1;
          if (next === null) return;
          event.preventDefault();
          render(tabs[next].dataset.context);
          tabs[next].focus();
        });
      });

      render('door');
    },
  };
})();
