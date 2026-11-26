'use strict';

/* 01. Угадай следующее слово: полоски вероятностей. */
(function () {
  window.Demos = window.Demos || {};

  window.Demos.predict = {
    init(model) {
      const { t } = window.LLM_I18N;
      const input = document.getElementById('predict-input');
      const out = document.getElementById('predict-out');
      const note = document.getElementById('predict-note');
      if (!input || !out || !note) return;

      const render = () => {
        const typedTokens = window.LLM.tokenize(input.value);
        const { items, source } = window.LLM.predictNext(model, input.value);
        out.textContent = '';

        if (!items.length) {
          note.textContent = t('predict.empty');
          return;
        }

        const top = items.slice(0, 5);
        const best = top[0].p;

        top.forEach((item) => {
          const row = document.createElement('div');
          row.className = 'pred-row';

          const token = document.createElement('span');
          token.className = 'pred-token';
          token.textContent = item.token;

          const track = document.createElement('span');
          track.className = 'pred-track';
          const fill = document.createElement('span');
          fill.className = 'pred-fill';
          fill.style.width = Math.max(4, (item.p / best) * 100) + '%';
          track.appendChild(fill);

          const pct = document.createElement('span');
          pct.className = 'pred-pct';
          pct.textContent = (item.p * 100).toFixed(0) + '%';

          row.append(token, track, pct);
          out.appendChild(row);
        });

        if (!input.value.trim()) {
          note.textContent = t('predict.emptyInput');
        } else if (source === 'unigram') {
          note.textContent = t('predict.unknown');
        } else if (source === 'bigram' && typedTokens.length <= 1) {
          note.textContent = t('predict.bigramShort');
        } else if (source === 'bigram') {
          note.textContent = t('predict.bigram');
        } else if (source === 'trigram') {
          note.textContent = t('predict.trigram');
        } else {
          note.textContent = t('predict.fallback');
        }
      };

      input.addEventListener('input', render);
      render();
    },
  };
})();
