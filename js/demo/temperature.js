'use strict';

/* 06. Температура: одно стартовое слово, разные распределения. */
(function () {
  window.Demos = window.Demos || {};

  const PROMPT = 'дед';
  const SEED = 20261126;
  const TOP = 5;

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function fmt(value) {
    return value.toFixed(1).replace('.', ',');
  }

  /** Полоски вероятностей для выбранной температуры. */
  function renderBars(container, model, temperature) {
    const { items } = window.LLM.predictNext(model, PROMPT);
    const dist = window.LLM.applyTemperature(items, temperature).slice(0, TOP);
    const best = dist.length ? dist[0].p : 1;

    dist.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'temp-bar-row';

      const token = document.createElement('span');
      token.textContent = item.token;

      const track = document.createElement('span');
      track.className = 'tp-track';
      const fill = document.createElement('i');
      fill.style.width = Math.max(2, (item.p / best) * 100) + '%';
      track.appendChild(fill);

      const pct = document.createElement('span');
      pct.className = 'tp-pct';
      pct.textContent = (item.p * 100).toFixed(0) + '%';

      row.append(token, track, pct);
      container.appendChild(row);
    });
  }

  window.Demos.temperature = {
    init(model) {
      const slider = document.getElementById('temp-slider');
      const label = document.getElementById('temp-value');
      const host = document.getElementById('temp-columns');
      if (!slider || !label || !host) return;

      let debounce = null;

      const render = () => {
        const value = Number(slider.value);
        label.textContent = fmt(value);

        const temps = [0.2, value, 1.8];
        const titles = ['Температура 0,2', 'Выбранная: ' + fmt(value), 'Температура 1,8'];

        host.textContent = '';

        temps.forEach((temperature, i) => {
          const panel = document.createElement('div');
          panel.className = 'temp-panel';
          if (i === 1) panel.classList.add('is-focus');

          const title = document.createElement('h3');
          title.textContent = titles[i];

          const bars = document.createElement('div');
          bars.className = 'temp-bars';
          renderBars(bars, model, temperature);

          const sample = document.createElement('p');
          sample.className = 'temp-sample';
          const result = window.LLM.generate(model, PROMPT, {
            temperature,
            maxTokens: 4,
            rng: mulberry32(SEED),
          });
          sample.textContent = 'пример: ' + result.tokens.join(' ');

          panel.append(title, bars, sample);
          host.appendChild(panel);
        });
      };

      slider.addEventListener('input', () => {
        if (debounce) clearTimeout(debounce);
        debounce = setTimeout(render, 60);
      });

      render();
    },
  };
})();
