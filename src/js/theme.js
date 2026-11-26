'use strict';

/*
 * Настройки оформления: режим (авто / светлая / тёмная) и цветовая палитра.
 *  - Режим — атрибут data-theme на <html>; «авто» = атрибута нет, тема как в системе.
 *  - Палитра — атрибут data-palette на <html>; amber — по умолчанию.
 * Выбор запоминается в localStorage. Если хранилище недоступно, всё работает без памяти.
 * Атрибуты ставятся ещё в <head> (index.html), до первой отрисовки; здесь — панель настроек.
 * Список палитр должен совпадать с блоками в styles.css и проверкой в index.html.
 */
(function (global) {
  const STORAGE_KEY = 'llm-howto.theme';
  const PALETTE_KEY = 'llm-howto.palette';
  const MODES = ['auto', 'light', 'dark'];
  const PALETTES = ['amber', 'coral', 'indigo', 'sage', 'paper'];
  const DEFAULT_PALETTE = PALETTES[0];

  function normalizeMode(value) {
    return MODES.includes(value) ? value : 'auto';
  }

  function normalizePalette(value) {
    return PALETTES.includes(value) ? value : DEFAULT_PALETTE;
  }

  function safeGet(storage, key) {
    try {
      return storage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  /** Сохранённый режим: light, dark или null (= авто). */
  function readStored(storage) {
    const value = safeGet(storage, STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  }

  /** Сохранённая палитра или палитра по умолчанию. */
  function readPalette(storage) {
    return normalizePalette(safeGet(storage, PALETTE_KEY));
  }

  function save(storage, mode, palette) {
    try {
      if (mode === 'auto') storage.removeItem(STORAGE_KEY);
      else storage.setItem(STORAGE_KEY, mode);
      if (palette === DEFAULT_PALETTE) storage.removeItem(PALETTE_KEY);
      else storage.setItem(PALETTE_KEY, palette);
    } catch (error) {
      // Без хранилища выбор просто не запомнится на следующий визит.
    }
  }

  /** Ставит атрибуты на <html>: без атрибута — режим «авто» и палитра по умолчанию. */
  function apply(root, mode, palette) {
    if (mode === 'light' || mode === 'dark') root.dataset.theme = mode;
    else delete root.dataset.theme;
    if (palette && palette !== DEFAULT_PALETTE) root.dataset.palette = palette;
    else delete root.dataset.palette;
  }

  /** Тема, которая сейчас видна: явный выбор или системная. */
  function effectiveTheme(root, prefersDark) {
    if (root.dataset.theme === 'dark' || root.dataset.theme === 'light') return root.dataset.theme;
    return prefersDark ? 'dark' : 'light';
  }

  function init() {
    const doc = global.document;
    const root = doc.documentElement;
    const toggle = doc.getElementById('settings-toggle');
    const panel = doc.getElementById('settings-panel');
    if (!toggle || !panel) return;

    const storage = global.localStorage;
    const media = global.matchMedia ? global.matchMedia('(prefers-color-scheme: dark)') : null;
    const metaColor = doc.querySelector('meta[name="theme-color"]');

    let mode = normalizeMode(root.dataset.theme);
    let palette = normalizePalette(root.dataset.palette);

    /* Цвет строки браузера на телефонах — как фон страницы. */
    function syncMetaColor() {
      if (!metaColor) return;
      const bg = global.getComputedStyle(root).getPropertyValue('--bg').trim();
      if (bg) metaColor.setAttribute('content', bg);
    }

    function syncInputs() {
      panel.querySelectorAll('input[name="theme-mode"]').forEach((input) => {
        input.checked = input.value === mode;
      });
      panel.querySelectorAll('input[name="theme-palette"]').forEach((input) => {
        input.checked = input.value === palette;
      });
    }

    panel.addEventListener('change', (event) => {
      const input = event.target;
      if (input.name === 'theme-mode') mode = normalizeMode(input.value);
      else if (input.name === 'theme-palette') palette = normalizePalette(input.value);
      else return;
      apply(root, mode, palette);
      save(storage, mode, palette);
      syncMetaColor();
    });

    if (media && media.addEventListener) media.addEventListener('change', syncMetaColor);

    /* ---------- Открытие и закрытие панели ---------- */

    const isOpen = () => !panel.hidden;

    function setOpen(open, { focusToggle = false } = {}) {
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      if (open) {
        const checked = panel.querySelector('input:checked');
        if (checked) checked.focus({ preventScroll: true });
      } else if (focusToggle) {
        toggle.focus();
      }
    }

    toggle.addEventListener('click', () => setOpen(!isOpen()));

    /* Фокус ушёл из панели клавишей Tab — закрываем. */
    panel.addEventListener('focusout', (event) => {
      const to = event.relatedTarget;
      if (isOpen() && to && !panel.contains(to) && !toggle.contains(to)) setOpen(false);
    });

    doc.addEventListener('click', (event) => {
      if (isOpen() && !panel.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
    });

    doc.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isOpen()) setOpen(false, { focusToggle: true });
    });

    syncInputs();
    syncMetaColor();
  }

  const api = {
    STORAGE_KEY,
    PALETTE_KEY,
    MODES,
    PALETTES,
    normalizeMode,
    normalizePalette,
    readStored,
    readPalette,
    apply,
    effectiveTheme,
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else if (global.document) {
    init();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
