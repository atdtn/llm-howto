'use strict';

/*
 * Конечный автомат воспроизведения генерации: idle / auto / paused.
 * Чистая логика без DOM — её проверяют тесты, демо только рисует.
 */
(function (global) {
  const MODES = ['idle', 'auto', 'paused'];

  function createPlaybackState() {
    return { mode: 'idle', remaining: 0 };
  }

  function checkState(state) {
    if (!state || typeof state !== 'object') {
      throw new TypeError('transitionPlayback: expected a state');
    }
    if (!MODES.includes(state.mode)) {
      throw new TypeError('transitionPlayback: unknown mode ' + state.mode);
    }
    if (!Number.isInteger(state.remaining) || state.remaining < 0) {
      throw new TypeError('transitionPlayback: invalid remaining');
    }
  }

  function transitionPlayback(state, event) {
    checkState(state);
    if (!event || typeof event.type !== 'string') {
      throw new TypeError('transitionPlayback: expected an event');
    }

    switch (event.type) {
      case 'start': {
        if (!Number.isInteger(event.count) || event.count <= 0) {
          throw new TypeError('transitionPlayback: count must be a positive integer');
        }
        return { mode: 'auto', remaining: event.count };
      }
      case 'step': {
        if (state.mode !== 'auto') return { mode: state.mode, remaining: state.remaining };
        const next = state.remaining - 1;
        return next <= 0 ? { mode: 'idle', remaining: 0 } : { mode: 'auto', remaining: next };
      }
      case 'pause': {
        return state.mode === 'auto'
          ? { mode: 'paused', remaining: state.remaining }
          : { mode: state.mode, remaining: state.remaining };
      }
      case 'resume': {
        return state.mode === 'paused' && state.remaining > 0
          ? { mode: 'auto', remaining: state.remaining }
          : { mode: state.mode, remaining: state.remaining };
      }
      case 'reset':
        return { mode: 'idle', remaining: 0 };
      default:
        throw new TypeError('transitionPlayback: unknown event ' + event.type);
    }
  }

  const api = { createPlaybackState, transitionPlayback };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    global.LLMGeneration = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
