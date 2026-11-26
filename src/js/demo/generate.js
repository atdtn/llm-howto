'use strict';

/* 05. Генерация по одному токену: авто, пауза, ручной выбор. */
(function () {
  window.Demos = window.Demos || {};

  const STEP_MS = 620;
  const TEMPERATURE = 0.85;
  const AUTO_TOKENS = 18;
  const MORE_TOKENS = 10;
  const MAX_TOKENS = 80;

  window.Demos.generate = {
    init(model) {
      const { t } = window.LLM_I18N;
      const input = document.getElementById('generate-input');
      const startBtn = document.getElementById('generate-start');
      const moreBtn = document.getElementById('generate-more');
      const pauseBtn = document.getElementById('generate-pause');
      const resetBtn = document.getElementById('generate-reset');
      const output = document.getElementById('generate-output');
      const candidates = document.getElementById('generate-candidates');
      if (!input || !startBtn || !moreBtn || !pauseBtn || !resetBtn || !output || !candidates) return;

      const G = window.LLMGeneration;
      let state = G.createPlaybackState();
      let tokens = [];
      let pending = null;
      let timer = null;
      let session = 0;

      const clearTimer = () => {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
      };

      const promptTokens = () => window.LLM.tokenize(input.value);

      /*
       * Распределение считается после каждого добавленного токена, поэтому
       * ручной выбор всегда продолжает именно видимый текст.
       */
      const computePending = () => {
        const { items } = window.LLM.predictNext(model, tokens);
        if (!items.length) {
          pending = null;
          return;
        }
        const dist = window.LLM.applyTemperature(items, TEMPERATURE);
        pending = { token: window.LLM.sample(dist, Math.random), dist };
      };

      const renderText = (markLast) => {
        output.textContent = '';
        tokens.forEach((token, i) => {
          const span = document.createElement('span');
          span.className = 'gen-token';
          if (markLast && i === tokens.length - 1) span.classList.add('is-new');
          span.textContent = token + ' ';
          output.appendChild(span);
        });
      };

      const candidateRow = (item, clickable) => {
        const isChosen = item.token === pending.token;
        const row = document.createElement(clickable ? 'button' : 'div');
        if (clickable) row.type = 'button';
        row.className =
          'cand-row' + (clickable ? ' is-clickable' : '') + (isChosen ? ' is-chosen' : '');

        const token = document.createElement('span');
        token.textContent = item.token;
        const pct = document.createElement('span');
        pct.textContent = (item.p * 100).toFixed(0) + '%';
        if (clickable) {
          /* Подсказка для экранных чтецов; видимый текст входит в имя кнопки целиком. */
          const hint = document.createElement('span');
          hint.className = 'visually-hidden';
          hint.textContent = t('generate.pickPrefix') + ' ';
          row.append(hint);
        }
        row.append(token, pct);

        if (clickable) row.addEventListener('click', () => choose(item.token));
        return row;
      };

      const renderCandidates = () => {
        candidates.textContent = '';

        const title = document.createElement('p');
        title.className = 'cand-title';

        if (!pending) {
          title.textContent = t('generate.noNext');
          candidates.appendChild(title);
          return;
        }

        const auto = state.mode === 'auto';
        title.textContent = auto ? t('generate.autoPrompt') : t('generate.pickPrompt');
        candidates.appendChild(title);

        pending.dist.slice(0, 4).forEach((item) => {
          candidates.appendChild(candidateRow(item, !auto));
        });
      };

      const renderControls = () => {
        const auto = state.mode === 'auto';
        const paused = state.mode === 'paused';
        startBtn.disabled = auto;
        moreBtn.disabled = auto;
        pauseBtn.disabled = !auto && !paused;
        pauseBtn.textContent = paused ? t('generate.resume') : t('generate.pause');
        input.disabled = auto || paused;
      };

      const render = (markLast) => {
        renderText(markLast);
        renderCandidates();
        renderControls();
      };

      const choose = (token) => {
        if (state.mode === 'auto' || !pending) return;
        if (tokens.length >= MAX_TOKENS) return;
        tokens.push(token);
        computePending();
        render(true);
      };

      const schedule = () => {
        clearTimer();
        const mySession = session;
        timer = setTimeout(() => {
          timer = null;
          if (mySession !== session || state.mode !== 'auto') return;

          if (!pending) {
            state = G.transitionPlayback(state, { type: 'reset' });
            render();
            return;
          }

          tokens.push(pending.token);
          state = G.transitionPlayback(state, { type: 'step' });
          computePending();
          render(true);

          if (state.mode === 'auto') schedule();
        }, STEP_MS);
      };

      const startSeries = (count) => {
        if (tokens.length >= MAX_TOKENS) {
          candidates.textContent = '';
          const note = document.createElement('p');
          note.className = 'cand-title';
          note.textContent = t('generate.enough');
          candidates.appendChild(note);
          return;
        }
        const allowed = Math.min(count, MAX_TOKENS - tokens.length);
        session += 1;
        clearTimer();
        state = G.transitionPlayback(state, { type: 'start', count: allowed });
        computePending();
        render();
        schedule();
      };

      const reset = () => {
        session += 1;
        clearTimer();
        state = G.transitionPlayback(state, { type: 'reset' });
        tokens = promptTokens();
        computePending();
        render();
      };

      startBtn.addEventListener('click', () => {
        tokens = promptTokens();
        if (!tokens.length) {
          input.focus();
          return;
        }
        session += 1;
        clearTimer();
        state = G.transitionPlayback(state, { type: 'reset' });
        startSeries(AUTO_TOKENS);
      });

      moreBtn.addEventListener('click', () => {
        if (!tokens.length) tokens = promptTokens();
        startSeries(MORE_TOKENS);
      });

      pauseBtn.addEventListener('click', () => {
        if (state.mode === 'auto') {
          state = G.transitionPlayback(state, { type: 'pause' });
          clearTimer();
        } else if (state.mode === 'paused') {
          state = G.transitionPlayback(state, { type: 'resume' });
          schedule();
        }
        render(false);
      });

      resetBtn.addEventListener('click', reset);

      input.addEventListener('input', () => {
        if (state.mode !== 'idle') return;
        tokens = promptTokens();
        computePending();
        render();
      });

      reset();
    },
  };
})();
