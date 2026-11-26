'use strict';

/* 07. Обучение: как подстройка чисел меняет вероятности. */
(function () {
  window.Demos = window.Demos || {};

  window.Demos.learn = {
    init() {
      const { t, num, locale } = window.LLM_I18N;
      const slider = document.getElementById('learn-slider');
      const stepOut = document.getElementById('learn-step');
      const out = document.getElementById('learn-out');
      if (!slider || !stepOut || !out) return;

      const Learn = window.LLMLearn;
      const labels = locale.data.learnLabels;
      const collator = new Intl.Collator(locale.intl);

      const render = () => {
        const step = Number(slider.value);
        stepOut.textContent = String(step);

        const dist = Learn.trainingDistribution(step)
          .slice()
          .sort((a, b) => b.p - a.p || collator.compare(labels[a.id], labels[b.id]));

        out.textContent = '';

        dist.forEach((item) => {
          const row = document.createElement('div');
          row.className = 'pred-row';

          const tokenWrap = document.createElement('span');
          tokenWrap.className = 'learn-token';

          const token = document.createElement('span');
          token.className = 'pred-token';
          token.textContent = labels[item.id];
          tokenWrap.appendChild(token);

          if (item.id === Learn.ANSWER_ID) {
            row.classList.add('is-answer');
            const badge = document.createElement('span');
            badge.className = 'answer-badge';
            badge.textContent = t('learn.answer');
            tokenWrap.appendChild(badge);
          }

          const track = document.createElement('span');
          track.className = 'pred-track';
          const fill = document.createElement('i');
          fill.style.width = (item.p * 100).toFixed(1) + '%';
          track.appendChild(fill);

          const pct = document.createElement('span');
          pct.className = 'pred-pct';
          pct.textContent = num(item.p * 100, 1) + '%';

          row.append(tokenWrap, track, pct);
          out.appendChild(row);
        });
      };

      slider.addEventListener('input', render);
      render();
    },
  };
})();
