'use strict';

/* 06. Температура: одно стартовое слово, разные распределения. */
(function () {
  window.Demos = window.Demos || {};

  /*
   * Зерно случайности; у каждой колонки своё (SEED + номер колонки), иначе при 1,0 и 1,8
   * выбор часто совпадал и примеры были одинаковыми. Зерно подобрано так, что тексты
   * трёх колонок различаются во всех языках (проверяет js/tests/model.test.js).
   */
  const SEED = 20261127;
  const TOP = 5;

  /** Полоски вероятностей для выбранной температуры. */
  function renderBars(container, model, prompt, temperature) {
    const { items } = window.LLM.predictNext(model, prompt);
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
      const { t, num } = window.LLM_I18N;
      const PROMPT = t('temperature.prompt');
      const slider = document.getElementById('temp-slider');
      const label = document.getElementById('temp-value');
      const host = document.getElementById('temp-columns');
      if (!slider || !label || !host) return;

      let debounce = null;

      const render = () => {
        const value = Number(slider.value);
        label.textContent = num(value, 1);

        const temps = [0.2, value, 1.8];
        const titles = [
          t('temperature.cold', { value: num(0.2, 1) }),
          t('temperature.selected', { value: num(value, 1) }),
          t('temperature.hot', { value: num(1.8, 1) }),
        ];

        host.textContent = '';

        temps.forEach((temperature, i) => {
          const panel = document.createElement('div');
          panel.className = 'temp-panel';
          if (i === 1) panel.classList.add('is-focus');

          const title = document.createElement('h3');
          title.textContent = titles[i];

          const bars = document.createElement('div');
          bars.className = 'temp-bars';
          renderBars(bars, model, PROMPT, temperature);

          const sample = document.createElement('p');
          sample.className = 'temp-sample';
          const result = window.LLM.generate(model, PROMPT, {
            temperature,
            maxTokens: 4,
            rng: window.LLM.mulberry32(SEED + i),
          });
          sample.textContent = t('temperature.sample', { tokens: result.tokens.join(' ') });

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
