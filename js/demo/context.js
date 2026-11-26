'use strict';

/* 03. Контекст: одно слово, два разных смысла. */
(function () {
  window.Demos = window.Demos || {};

  const DATA = {
    door: {
      sentence: 'Он достал из кармана ключ и открыл дверь.',
      neighbors: ['замок', 'дверь', 'скважина', 'квартира', 'потерять'],
    },
    music: {
      sentence: 'В начале нотной строки стоит скрипичный ключ.',
      neighbors: ['ноты', 'скрипка', 'музыка', 'альт', 'партитура'],
    },
  };

  window.Demos.context = {
    init() {
      const sentence = document.getElementById('context-sentence');
      const out = document.getElementById('context-out');
      const tabs = Array.from(document.querySelectorAll('[data-context]'));
      if (!sentence || !out || !tabs.length) return;

      const render = (key) => {
        const data = DATA[key];
        if (!data) return;

        sentence.textContent = '';

        const parts = data.sentence.split('ключ');
        parts.forEach((part, i) => {
          sentence.appendChild(document.createTextNode(part));
          if (i < parts.length - 1) {
            const em = document.createElement('em');
            em.textContent = 'ключ';
            sentence.appendChild(em);
          }
        });

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
