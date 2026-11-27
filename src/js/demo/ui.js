'use strict';

/*
 * Общие мелочи для демо, чтобы с ними было удобно работать с телефона:
 *  - ряд кнопок с готовыми вариантами (начала фраз, примеры текстов) — без клавиатуры;
 *  - поле ввода: Enter прячет клавиатуру, а если она закрыла результат, демо
 *    прокручивается к верху экрана.
 */
(function () {
  /**
   * Ряд кнопок-подсказок. items — строки или { label, value }.
   * Возвращает элемент; current(value) отмечает кнопку, совпадающую с текущим значением.
   */
  function chipRow(label, items, onPick) {
    const row = document.createElement('div');
    row.className = 'chip-row';
    row.setAttribute('role', 'group');
    row.setAttribute('aria-label', label.replace(/:$/, ''));

    const title = document.createElement('span');
    title.className = 'chip-row-label';
    title.setAttribute('aria-hidden', 'true');
    title.textContent = label;
    row.appendChild(title);

    const buttons = items.map((item) => {
      const value = typeof item === 'string' ? item : item.value;
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chip';
      button.textContent = typeof item === 'string' ? item : item.label;
      button.dataset.value = value;
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => onPick(value));
      row.appendChild(button);
      return button;
    });

    row.current = (value) => {
      const norm = (text) => String(text).trim().toLowerCase();
      buttons.forEach((button) => {
        button.setAttribute('aria-pressed', String(norm(button.dataset.value) === norm(value)));
      });
    };
    return row;
  }

  const coarse = window.matchMedia ? window.matchMedia('(pointer: coarse)') : { matches: false };

  /**
   * Поле ввода на телефоне: после появления клавиатуры прокручиваем демо так,
   * чтобы поле и результат под ним были видны. onEnter — что делать по Enter
   * (по умолчанию просто спрятать клавиатуру).
   */
  function touchFriendlyInput(input, onEnter) {
    input.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' || event.isComposing || input.tagName === 'TEXTAREA') return;
      event.preventDefault();
      if (onEnter) onEnter();
      input.blur();
    });

    input.addEventListener('focus', () => {
      if (!coarse.matches) return;
      const demo = input.closest('.demo') || input;
      /* Клавиатура выезжает не сразу: ждём, пока окно уменьшится. */
      const scroll = () => demo.scrollIntoView({ block: 'start', behavior: 'smooth' });
      if (window.visualViewport) {
        let done = false;
        const once = () => {
          if (done) return;
          done = true;
          window.visualViewport.removeEventListener('resize', once);
          scroll();
        };
        window.visualViewport.addEventListener('resize', once);
        setTimeout(once, 450);
      } else {
        setTimeout(scroll, 300);
      }
    });
  }

  window.DemoUI = { chipRow, touchFriendlyInput };
})();
