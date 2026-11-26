'use strict';

/*
 * Меню разделов и шапка.
 *  - Подсветка текущего раздела (в боковой колонке и на кнопке меню).
 *  - Выпадающее меню на узких экранах: открывается кнопкой, закрывается
 *    по Esc, щелчку мимо, выбору раздела.
 *  - Полоска прогресса чтения под шапкой.
 *  - Меню языков: закрывается по Esc и щелчку мимо, при переходе на другой
 *    язык сохраняется текущий раздел (#якорь).
 * Без JavaScript всё это остаётся обычными ссылками.
 */
(function (global) {
  /**
   * Индекс текущего раздела: последний, чей верх уже поднялся выше линии
   * line (в пикселях документа). -1 — пока ни один раздел не начался.
   */
  function activeIndex(tops, line) {
    let index = -1;
    for (let i = 0; i < tops.length; i++) {
      if (tops[i] <= line) index = i;
      else break;
    }
    return index;
  }

  /** Доля прочитанного: от 0 до 1. */
  function readProgress(scrollY, docHeight, viewHeight) {
    const range = docHeight - viewHeight;
    if (range <= 0) return 1;
    return Math.min(1, Math.max(0, scrollY / range));
  }

  /** Ссылка на другой язык с тем же разделом. */
  function withHash(href, hash) {
    if (!hash || hash === '#top') return href;
    return href.split('#')[0] + hash;
  }

  function init() {
    const doc = global.document;
    const root = doc.documentElement;
    const header = doc.getElementById('site-header');
    const toc = doc.getElementById('toc');
    const toggle = doc.getElementById('toc-toggle');
    const currentNum = doc.getElementById('toc-current-num');
    const currentLabel = doc.getElementById('toc-current-label');
    const progressBar = doc.getElementById('read-progress');
    const langMenu = doc.querySelector('.lang-menu');
    if (!header || !toc || !toggle) return;

    const links = Array.from(toc.querySelectorAll('a[href^="#"]'));
    const sections = links.map((link) => doc.getElementById(link.hash.slice(1)));
    const defaultLabel = currentLabel.textContent;

    /* ---------- Выпадающее меню ---------- */

    const isOpen = () => toc.classList.contains('is-open');

    function setOpen(open, { focusToggle = false } = {}) {
      toc.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      if (open) {
        const active = toc.querySelector('a[aria-current="true"]') || links[0];
        if (active) active.focus({ preventScroll: true });
      } else if (focusToggle) {
        toggle.focus();
      }
    }

    toggle.addEventListener('click', () => setOpen(!isOpen()));

    links.forEach((link) => link.addEventListener('click', () => setOpen(false)));

    doc.addEventListener('click', (event) => {
      if (isOpen() && !toc.contains(event.target) && !toggle.contains(event.target)) setOpen(false);
      if (langMenu && langMenu.open && !langMenu.contains(event.target)) langMenu.open = false;
    });

    doc.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (isOpen()) setOpen(false, { focusToggle: true });
      if (langMenu && langMenu.open) {
        langMenu.open = false;
        langMenu.querySelector('summary').focus();
      }
    });

    /* Стрелки вверх/вниз внутри открытого меню. */
    toc.addEventListener('keydown', (event) => {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
      const index = links.indexOf(doc.activeElement);
      if (index < 0) return;
      event.preventDefault();
      const next = (index + (event.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length;
      links[next].focus();
    });

    /* Если меню открыто и экран стал широким (колонка), состояние сбрасываем. */
    const wide = global.matchMedia('(min-width: 1200px)');
    const onWide = () => { if (wide.matches) setOpen(false); };
    if (wide.addEventListener) wide.addEventListener('change', onWide);

    /* ---------- Логотип: в самый верх страницы ---------- */

    const brand = header.querySelector('.brand');
    if (brand) {
      brand.addEventListener('click', (event) => {
        event.preventDefault();
        setOpen(false);
        global.scrollTo({ top: 0 });
        /* Якорь раздела из адреса убираем: обновление страницы тоже откроет начало. */
        if (global.location.hash && global.history.replaceState) {
          global.history.replaceState(null, '', global.location.pathname + global.location.search);
        }
      });
    }

    /* ---------- Язык: сохраняем раздел при переходе ---------- */

    if (langMenu) {
      langMenu.querySelectorAll('a[hreflang]').forEach((link) => {
        link.addEventListener('click', () => {
          link.href = withHash(link.getAttribute('href'), global.location.hash);
        });
      });
    }

    /* ---------- Текущий раздел и прогресс ---------- */

    let current = -2;

    function render(index) {
      if (index === current) return;
      current = index;
      links.forEach((link, i) => {
        if (i === index) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
      if (index >= 0) {
        currentNum.textContent = links[index].querySelector('.toc-num').textContent;
        currentNum.hidden = false;
        currentLabel.textContent = links[index].querySelector('.toc-text').textContent;
      } else {
        currentNum.hidden = true;
        currentLabel.textContent = defaultLabel;
      }
    }

    let frame = 0;
    function update() {
      frame = 0;
      const scrollY = global.scrollY;
      const line = scrollY + header.offsetHeight + global.innerHeight * 0.25;
      const tops = sections.map((section) => (section ? section.getBoundingClientRect().top + scrollY : Infinity));
      const atBottom = scrollY + global.innerHeight >= root.scrollHeight - 2;
      render(atBottom ? sections.length - 1 : activeIndex(tops, line));
      if (progressBar) {
        const share = readProgress(scrollY, root.scrollHeight, global.innerHeight);
        progressBar.style.transform = `scaleX(${share})`;
      }
      header.classList.toggle('is-scrolled', scrollY > 4);
    }

    const schedule = () => { if (!frame) frame = global.requestAnimationFrame(update); };
    global.addEventListener('scroll', schedule, { passive: true });
    global.addEventListener('resize', schedule);
    update();
  }

  const api = { activeIndex, readProgress, withHash };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else if (global.document) {
    if (global.document.readyState === 'loading') {
      global.document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
