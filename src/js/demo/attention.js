'use strict';

/* 04. Внимание: наведение на слово подсвечивает связанные слова. */
(function () {
  window.Demos = window.Demos || {};

  /*
   * Упрощённая карта внимания: строка — слово, которое «смотрит»,
   * столбец — слово, на которое смотрят. Веса от 0 до 1.
   * У настоящей модели такие веса вычисляются сами.
   * Строки и столбцы — смысловые роли английской фразы: кот, который, сидел, на,
   * подоконнике, уронил, цветок. Слова берутся из языкового словаря; если порядок слов
   * в языке другой, attentionSlots говорит, какой роли соответствует каждое слово
   * (в немецком придаточное кончается глаголом, а «um» — часть глагола «umstoßen»).
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

  window.Demos.attention = {
    init() {
      const { t, locale } = window.LLM_I18N;
      const host = document.getElementById('attention-sentence');
      const caption = document.getElementById('attention-caption');
      if (!host || !caption) return;

      const WORDS = locale.data.attentionWords;
      const NAMES = locale.data.attentionNames;
      const COMMA_AFTER = locale.data.attentionCommaAfter;
      const SLOTS = locale.data.attentionSlots || WORDS.map((_, i) => i);

      /* Вес между словами i и j; два слова одной роли (части одного глагола) связаны сильно. */
      const weight = (i, j) => (SLOTS[i] === SLOTS[j] ? 0.9 : WEIGHTS[SLOTS[i]][SLOTS[j]]);
      const DEFAULT_CAPTION = t('attention.caption');

      const spans = [];

      const addWord = (index) => {
        const span = document.createElement('span');
        span.className = 'aw';
        span.textContent = WORDS[index];
        span.dataset.index = String(index);
        span.tabIndex = 0;
        span.setAttribute('role', 'button');
        span.setAttribute('aria-label', t('attention.ariaLabel', { word: NAMES[index] }));
        host.appendChild(span);
        spans[index] = span;
      };

      const build = () => {
        host.textContent = '';
        for (let i = 0; i < WORDS.length; i++) {
          addWord(i);
          if (COMMA_AFTER.includes(i)) host.appendChild(document.createTextNode(', '));
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

        const row = WORDS.map((_, j) => weight(index, j));
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

        const list = ranked
          .map((item) =>
            t('attention.item', { word: NAMES[item.j], pct: Math.round(item.weight * 100) })
          )
          .join(t('attention.and'));

        caption.textContent = t('attention.focus', { word: NAMES[index], list });
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
