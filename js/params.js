'use strict';

/*
 * Оценка размера модели: параметры и вес файла в fp16.
 * Формула упрощённая: блоки 12·L·d² плюс эмбеддинги и выходной слой 2·V·d.
 */
(function (global) {
  const VOCAB_SIZE = 50000;
  const FP16_BYTES = 2;

  const PRESETS = {
    small: { layers: 12, width: 768 },
    medium: { layers: 32, width: 4096 },
    large: { layers: 80, width: 8192 },
  };

  function requirePositiveInt(value, name) {
    if (!Number.isInteger(value) || value <= 0) {
      throw new TypeError(name + ': ожидается положительное целое число');
    }
  }

  function estimateParameters(layers, width, vocabSize) {
    const vocab = vocabSize === undefined ? VOCAB_SIZE : vocabSize;
    requirePositiveInt(layers, 'layers');
    requirePositiveInt(width, 'width');
    requirePositiveInt(vocab, 'vocabSize');

    const parameters = 12 * layers * width * width + 2 * vocab * width;
    const fp16Bytes = parameters * FP16_BYTES;
    return { parameters, fp16Bytes, fp16GB: fp16Bytes / 1e9 };
  }

  const api = { estimateParameters, PRESETS, VOCAB_SIZE, FP16_BYTES };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    global.LLMParams = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
