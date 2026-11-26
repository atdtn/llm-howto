'use strict';

/* 08. Устройство модели: этапы и калькулятор параметров. */
(function () {
  window.Demos = window.Demos || {};

  /* Порядок этапов фиксирован; тексты берутся из словаря по id. */
  const STAGE_IDS = ['tok', 'emb', 'blk', 'out', 'sm'];

  window.Demos.inside = {
    init() {
      const { t, num } = window.LLM_I18N;
      const host = document.getElementById('inside-stages');
      const description = document.getElementById('inside-description');
      const layers = document.getElementById('params-layers');
      const width = document.getElementById('params-width');
      const layersOut = document.getElementById('params-layers-value');
      const widthOut = document.getElementById('params-width-value');
      const countOut = document.getElementById('params-count');
      const sizeOut = document.getElementById('params-size');
      const presets = Array.from(document.querySelectorAll('[data-preset]'));
      if (!host || !description || !layers || !width || !layersOut || !widthOut || !countOut || !sizeOut) return;

      const Params = window.LLMParams;
      let selected = 'blk';

      const buttons = [];

      const fmtParams = (n) => {
        if (n >= 1e9) return num(n / 1e9, 1) + ' ' + t('units.bn');
        return num(Math.round(n / 1e6)) + ' ' + t('units.mn');
      };
      const fmtSize = (gb) => num(gb, 1) + ' ' + t('units.gb');

      const updateStages = () => {
        buttons.forEach((button, i) => {
          button.setAttribute('aria-pressed', String(STAGE_IDS[i] === selected));
        });

        description.textContent = '';
        const title = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = t('stage.' + selected + '.name') + ' — ';
        title.append(strong, t('stage.' + selected + '.text'));
        description.appendChild(title);
      };

      const buildStages = () => {
        host.textContent = '';
        STAGE_IDS.forEach((id, i) => {
          if (i > 0) {
            const arrow = document.createElement('div');
            arrow.className = 'stage-arrow';
            arrow.setAttribute('aria-hidden', 'true');
            arrow.textContent = '↓';
            host.appendChild(arrow);
          }

          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'stage-button';
          button.setAttribute('aria-pressed', 'false');

          const name = document.createElement('span');
          name.className = 'stage-name';
          name.textContent = t('stage.' + id + '.name');

          const tag = document.createElement('span');
          tag.className = 'stage-tag';
          tag.textContent = t('stage.' + id + '.tag');

          button.append(name, tag);
          button.addEventListener('click', () => {
            selected = id;
            updateStages();
          });
          host.appendChild(button);
          buttons.push(button);
        });
      };

      const renderParams = () => {
        const L = Number(layers.value);
        const d = Number(width.value);
        layersOut.textContent = String(L);
        widthOut.textContent = String(d);

        const result = Params.estimateParameters(L, d);
        countOut.textContent = '≈ ' + fmtParams(result.parameters);
        sizeOut.textContent = '≈ ' + fmtSize(result.fp16GB);

        presets.forEach((button) => {
          const preset = Params.PRESETS[button.dataset.preset];
          const active = preset && preset.layers === L && preset.width === d;
          button.classList.toggle('is-active', Boolean(active));
          button.setAttribute('aria-pressed', String(Boolean(active)));
        });
      };

      presets.forEach((button) => {
        button.addEventListener('click', () => {
          const preset = Params.PRESETS[button.dataset.preset];
          if (!preset) return;
          layers.value = String(preset.layers);
          width.value = String(preset.width);
          renderParams();
        });
      });

      layers.addEventListener('input', renderParams);
      width.addEventListener('input', renderParams);

      buildStages();
      updateStages();
      renderParams();
    },
  };
})();
