'use strict';

/* 04. Внимание: наведение на слово подсвечивает связанные слова. */
(function () {
  window.Demos = window.Demos || {};

  const WORDS = ['Кот', 'который', 'сидел', 'на', 'подоконнике', 'уронил', 'цветок'];

  /*
   * Упрощённая карта внимания: строка — слово, которое «смотрит»,
   * столбец — слово, на которое смотрят. Веса от 0 до 1.
   * У настоящей модели такие веса вычисляются сами.
   */
  const WEIGHTS = [
    [1.0, 0.6, 0.1, 0.2, 0.1, 0.3, 0.2],
    [0.95, 1.0, 0.2, 0.1, 0.5, 0.3, 0.1],
    [0.4, 0.9, 1.0, 0.3, 0.4, 0.2, 0.1],
    [0.1, 0.3, 0.6, 1.0, 0.5, 0.2, 0.1],
    [0.2, 0.4, 0.6, 0.4, 1.0, 0.3, 0.2],
    [0.8, 0.3, 0.2, 0.1, 0.2, 1.0, 0.6],
    [0.2, 0.1, 0.1, 0.1, 0.3, 0.9, 1.0],
  ];

  const DEFAULT_CAPTION = 'Наведи курсор, коснись слова или выбери его клавишей Tab.';

  window.Demos.attention = {
    init() {
      const host = document.getElementById('attention-sentence');
      const caption = document.getElementById('attention-caption');
      if (!host || !caption) return;

      const spans = [];

      const addWord = (index) => {
        const span = document.createElement('span');
        span.className = 'aw';
        span.textContent = WORDS[index];
        span.dataset.index = String(index);
        span.tabIndex = 0;
        span.setAttribute('role', 'button');
        span.setAttribute('aria-label', 'Показать, на что смотрит слово «' + WORDS[index].toLowerCase() + '»');
        host.appendChild(span);
        spans[index] = span;
      };

      const build = () => {
        host.textContent = '';
        const punctAfter = { 0: ', ', 4: ', ' };
        for (let i = 0; i < WORDS.length; i++) {
          addWord(i);
          if (punctAfter[i]) host.appendChild(document.createTextNode(punctAfter[i]));
          else if (i === WORDS.length - 1) host.appendChild(document.createTextNode('.'));
          else host.appendChild(document.createTextNode(' '));
        }
      };

      const clear = () => {
        spans.forEach((span) => {
          span.classList.remove('is-target', 'is-source');
          span.style.removeProperty('--w');
        });
        caption.textContent = DEFAULT_CAPTION;
      };

      const focus = (index) => {
        clear();
        spans[index].classList.add('is-target');

        const row = WEIGHTS[index];
        row.forEach((weight, j) => {
          if (j === index) return;
          if (weight < 0.15) return;
          spans[j].classList.add('is-source');
          spans[j].style.setProperty('--w', String(weight));
        });

        const ranked = row
          .map((weight, j) => ({ weight, j }))
          .filter((item) => item.j !== index)
          .sort((a, b) => b.weight - a.weight)
          .slice(0, 2);

        const names = ranked
          .map((item) => '«' + WORDS[item.j].toLowerCase() + '» (' + Math.round(item.weight * 100) + '%)')
          .join(' и ');

        caption.textContent = '«' + WORDS[index].toLowerCase() + '» смотрит на ' + names + '.';
      };

      build();
      spans.forEach((span) => {
        const activate = () => focus(Number(span.dataset.index));
        span.addEventListener('mouseenter', activate);
        span.addEventListener('click', activate);
        span.addEventListener('focus', activate);
        span.addEventListener('keydown', (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            activate();
          }
        });
      });
      host.addEventListener('mouseleave', () => {
        if (!host.contains(document.activeElement)) clear();
      });
      host.addEventListener('focusout', (event) => {
        if (!host.contains(event.relatedTarget)) clear();
      });
    },
  };
})();
