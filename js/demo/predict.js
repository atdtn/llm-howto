'use strict';

/* 01. Угадай следующее слово: полоски вероятностей. */
(function () {
  window.Demos = window.Demos || {};

  window.Demos.predict = {
    init(model) {
      const input = document.getElementById('predict-input');
      const out = document.getElementById('predict-out');
      const note = document.getElementById('predict-note');
      if (!input || !out || !note) return;

      const render = () => {
        const contextTokens = window.LLM.tokenize(input.value);
        const { items, source } = window.LLM.predictNext(model, input.value);
        out.textContent = '';

        if (!items.length) {
          note.textContent = 'Печатай — и появятся варианты продолжения.';
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
          note.textContent = 'Пока пусто — вот самые частые слова во встроенном тексте.';
        } else if (source === 'unigram') {
          note.textContent =
            'Такой фразы во встроенном тексте не было. Модель честно откатилась к самым частым словам — это её способ сказать «не знаю».';
        } else if (source === 'bigram' && contextTokens.length <= 1) {
          note.textContent = 'Модель узнала слово и вспомнила, что обычно идёт после него.';
        } else if (source === 'bigram') {
          note.textContent =
            'Такой пары слов модель не видела, но помнит, что бывает после последнего слова.';
        } else if (source === 'trigram') {
          note.textContent = 'Модель узнала эту пару слов и вспомнила, что обычно идёт после неё.';
        } else {
          note.textContent =
            'Так модель видит свой следующий шаг: у каждого слова — своя вероятность.';
        }
      };

      input.addEventListener('input', render);
      render();
    },
  };
})();
