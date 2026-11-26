'use strict';

/* 08. Устройство модели: этапы и калькулятор параметров. */
(function () {
  window.Demos = window.Demos || {};

  const STAGES = [
    {
      id: 'tok',
      name: 'Токены',
      tag: 'вход',
      text: 'Текст превращается в последовательность номеров — токенов. Дальше модель работает только с номерами.',
    },
    {
      id: 'emb',
      name: 'Эмбеддинг',
      tag: 'числа смысла',
      text: 'Каждый номер превращается в набор чисел — вектор. Похожие слова получают похожие наборы.',
    },
    {
      id: 'blk',
      name: 'Блоки трансформера, ×N',
      tag: 'основная часть',
      text: 'Блоки много раз уточняют представления слов. Внутри — внимание, которое переносит сведения между словами, и небольшая сеть, которая обрабатывает каждое слово отдельно.',
    },
    {
      id: 'out',
      name: 'Выходной слой',
      tag: 'оценки',
      text: 'Для каждого возможного следующего токена модель получает оценку: насколько он уместен.',
    },
    {
      id: 'sm',
      name: 'Softmax',
      tag: 'вероятности',
      text: 'Оценки превращаются в вероятности, которые в сумме дают 100%. Из них и выбирается следующее слово.',
    },
  ];

  function fmtParams(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(1).replace('.', ',') + ' млрд';
    return new Intl.NumberFormat('ru-RU').format(Math.round(n / 1e6)) + ' млн';
  }

  function fmtSize(gb) {
    return gb.toFixed(1).replace('.', ',') + ' ГБ';
  }

  window.Demos.inside = {
    init() {
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

      const updateStages = () => {
        buttons.forEach((button, i) => {
          button.setAttribute('aria-pressed', String(STAGES[i].id === selected));
        });

        const stage = STAGES.find((s) => s.id === selected);
        description.textContent = '';
        const title = document.createElement('p');
        const strong = document.createElement('strong');
        strong.textContent = stage.name + ' — ';
        title.append(strong, stage.text);
        description.appendChild(title);
      };

      const buildStages = () => {
        host.textContent = '';
        STAGES.forEach((stage, i) => {
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
          name.textContent = stage.name;

          const tag = document.createElement('span');
          tag.className = 'stage-tag';
          tag.textContent = stage.tag;

          button.append(name, tag);
          button.addEventListener('click', () => {
            selected = stage.id;
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
      renderParams();    },
  };
})();
