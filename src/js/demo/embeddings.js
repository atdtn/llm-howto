'use strict';

/* 03b. Слова как точки: условные векторы и ближайшие соседи. */
(function () {
  window.Demos = window.Demos || {};

  window.Demos.embeddings = {
    init() {
      const { t, num, locale } = window.LLM_I18N;
      const plot = document.getElementById('embedding-plot');
      const wordEl = document.getElementById('embedding-word');
      const vectorEl = document.getElementById('embedding-vector');
      const nearEl = document.getElementById('embedding-near');
      if (!plot || !wordEl || !vectorEl || !nearEl) return;

      const Emb = window.LLMEmbeddings;
      const labels = locale.data.embeddingLabels;
      const words = Emb.EMBEDDING_WORDS.map((w) => ({ ...w, word: labels[w.id] || w.id }));
      let selectedId = 'koshka';

      const buttons = new Map();

      words.forEach((word) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'embedding-point';
        button.style.left = word.vector[0] * 100 + '%';
        button.style.top = (1 - word.vector[1]) * 100 + '%';
        button.setAttribute('aria-pressed', 'false');
        button.setAttribute('aria-label', t('embeddings.aria', { word: word.word }));

        const dot = document.createElement('span');
        dot.className = 'emb-dot';

        const label = document.createElement('span');
        label.className = 'emb-label';
        label.textContent = word.word;

        button.append(dot, label);
        button.addEventListener('click', () => {
          selectedId = word.id;
          render();
        });
        plot.appendChild(button);
        buttons.set(word.id, button);
      });

      const render = () => {
        const selected = words.find((w) => w.id === selectedId);

        buttons.forEach((button, id) => {
          const on = id === selectedId;
          button.classList.toggle('is-selected', on);
          button.setAttribute('aria-pressed', String(on));
        });

        wordEl.textContent = selected.word;
        vectorEl.textContent = '[' + selected.vector.map((x) => num(x, 2)).join('; ') + ']';

        const near = Emb.nearestWords(words, selectedId);
        nearEl.textContent = '';
        near.forEach((item) => {
          const li = document.createElement('li');
          const name = document.createElement('span');
          name.textContent = labels[item.id] || item.id;
          const distance = document.createElement('span');
          distance.className = 'emb-distance';
          distance.textContent = num(item.distance, 2);
          li.append(name, distance);
          nearEl.appendChild(li);
        });
      };

      render();
    },
  };
})();
