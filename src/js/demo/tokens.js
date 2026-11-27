'use strict';

/* 02. Токены: текст на кусочки, у каждого кусочка номер. */
(function () {
  window.Demos = window.Demos || {};

  window.Demos.tokens = {
    init() {
      const { t, locale } = window.LLM_I18N;
      const input = document.getElementById('tokens-input');
      const out = document.getElementById('tokens-out');
      const note = document.getElementById('tokens-note');
      if (!input || !out || !note) return;

      let examples = null;

      const render = () => {
        const chunks = window.LLM.tokenizeForDisplay(input.value);
        out.textContent = '';

        chunks.forEach((chunk) => {
          const chip = document.createElement('span');
          chip.className = 'token-chip';

          const text = document.createElement('span');
          text.className = 't-text';
          text.textContent = chunk;

          const id = document.createElement('span');
          id.className = 't-id';
          id.textContent = window.LLM.tokenId(chunk);

          chip.append(text, id);
          out.appendChild(chip);
        });

        if (examples) examples.current(input.value);
        note.textContent = chunks.length
          ? t('tokens.count', { count: chunks.length })
          : t('tokens.empty');
      };

      /* Примеры текстов: показать, как режутся знаки, числа и эмодзи, не печатая. */
      examples = window.DemoUI.chipRow(
        t('tokens.examplesLabel'),
        (locale.data.tokenExamples || []).map((ex) => ({ label: ex.label, value: ex.text })),
        (text) => {
          input.value = text;
          render();
        }
      );
      input.insertAdjacentElement('afterend', examples);

      input.addEventListener('input', render);
      window.DemoUI.touchFriendlyInput(input);
      render();
    },
  };
})();
