'use strict';

/*
 * 01. Угадай следующее слово: полоски вероятностей.
 * Фразу можно напечатать, а можно собрать без клавиатуры: готовое начало
 * и нажатия на предложенные слова — как подсказки над клавиатурой телефона.
 */
(function () {
  window.Demos = window.Demos || {};

  window.Demos.predict = {
    init(model) {
      const { t, locale } = window.LLM_I18N;
      const UI = window.DemoUI;
      const input = document.getElementById('predict-input');
      const out = document.getElementById('predict-out');
      const note = document.getElementById('predict-note');
      if (!input || !out || !note) return;

      /* Добавить слово в конец фразы / убрать последнее слово. */
      const appendWord = (text, word) => (text.trim() ? text.trimEnd() + ' ' : '') + word;
      const dropWord = (text) => text.trimEnd().replace(/\s*\S+$/, '');

      const setPhrase = (text) => {
        input.value = text;
        render();
      };

      const starts = UI.chipRow(t('demo.startsLabel'), locale.data.predictStarts || [], setPhrase);
      input.insertAdjacentElement('afterend', starts);

      const actions = document.createElement('div');
      actions.className = 'phrase-actions';
      const backBtn = document.createElement('button');
      backBtn.type = 'button';
      backBtn.className = 'btn btn-ghost btn-small';
      backBtn.textContent = '⌫ ' + t('predict.back');
      backBtn.addEventListener('click', () => setPhrase(dropWord(input.value)));
      const clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.className = 'btn btn-ghost btn-small';
      clearBtn.textContent = t('predict.clear');
      clearBtn.addEventListener('click', () => setPhrase(''));
      actions.append(backBtn, clearBtn);
      out.insertAdjacentElement('afterend', actions);

      function render() {
        const typedTokens = window.LLM.tokenize(input.value);
        const { items, source } = window.LLM.predictNext(model, input.value);
        out.textContent = '';
        starts.current(input.value);
        backBtn.disabled = clearBtn.disabled = !input.value.trim();

        if (!items.length) {
          note.textContent = t('predict.empty');
          return;
        }

        const top = items.slice(0, 5);
        const best = top[0].p;

        top.forEach((item) => {
          /* Строка — кнопка: нажатие добавляет слово к фразе. */
          const row = document.createElement('button');
          row.type = 'button';
          row.className = 'pred-row';
          row.addEventListener('click', () => setPhrase(appendWord(input.value, item.token)));

          const hint = document.createElement('span');
          hint.className = 'visually-hidden';
          hint.textContent = t('predict.addPrefix') + ' ';

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

          row.append(hint, token, track, pct);
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
      }

      input.addEventListener('input', render);
      UI.touchFriendlyInput(input);
      render();
    },
  };
})();
