# How Language Models Work — Visually

**Live demo:** <https://atdtn.github.io/llm-howto/>

Languages: **English** · [Русский](README.ru.md) · [Deutsch](README.de.md)

An interactive, no-formulas explainer of the core idea behind chatbots, translators and autocomplete: **a language model is a machine that guesses the next word.** Everything else is detail built on top of that guess.

The page walks through nine short sections. Each one has a small hands-on demo you can poke at, so the ideas are something you see work rather than something you have to take on trust.

## What you'll see

| # | Section | The idea |
|---|---------|----------|
| 01 | Guess the next word | A model predicts a probability for every possible next word. |
| 02 | Tokens | Text is cut into pieces (tokens), and the model works with their numbers. |
| 03 | Context | The meaning of a word comes from the words around it, and is stored as a vector of numbers. |
| 04 | Attention | Each word "looks at" the others to decide which ones matter for its meaning. |
| 05 | One token at a time | The answer is built step by step, each time looking at the whole text so far. |
| 06 | Temperature | A knob that controls how cautious or adventurous the choice of the next token is. |
| 07 | Learning | The probabilities are not written by hand; training adjusts the numbers. |
| 08 | Inside the model | Stages of the pipeline, and how the model's size follows from its layers and width. |
| 09 | So is that it? | The same principle at a much larger scale, and why models sometimes sound right while being wrong. |

## Who it's for

People who use language models every day and want an intuitive picture of what is going on, without needing linear algebra or machine learning background.

## Languages

The site is available in three languages, each on its own address:

| Language | Address |
|----------|---------|
| English (default) | `/` |
| Русский | `/ru/` |
| Deutsch | `/de/` |

The language switcher at the top of the page moves between them. Every language has its own text and its own small built-in corpus, so the demos work with words that are natural in that language — German, for example, has its own tales, its own word map and its own umlauts.

Pages do not redirect based on the browser language. Each address always shows the same language, which is what search engines and shared links need.

### How translations are organised

- `src/index.html` holds the page structure. Text is marked with `data-i18n` attributes that name a key.
- `src/js/i18n/en.js`, `ru.js` and `de.js` are the dictionaries: page text, demo strings, example data and the corpus for each language.
- `scripts/build.js` renders one static page per language: it fills in the translated text, so the content is in the HTML itself, not added by JavaScript.
- `src/js/i18n.js` is the small translator the demos use in the browser; it takes the language from the page's `data-lang` attribute.
- `src/js/tests/i18n.test.js` checks that all languages have the same keys and placeholders, so a missing translation fails the tests instead of silently showing English.

To add a language, copy `src/js/i18n/en.js` to `src/js/i18n/<code>.js` and translate it. Then add the code to `LANGS` in `scripts/build.js`, a label in `languageSwitcher()` there, and the new locale to the lists in `src/js/tests/i18n.test.js` and `src/js/tests/site.test.js`. The tests will tell you what is missing.

## Search engine optimisation

Each language has its own page, so search engines can index all of them:

- **Static HTML per language** — the translated text is in the markup; crawlers do not need to run JavaScript.
- **`<html lang>`** set to the page language.
- **`rel="canonical"`** on every page.
- **`hreflang` alternates** for `en`, `ru` and `de`, plus `x-default` pointing to the English page.
- **`sitemap.xml`** listing all language pages with their alternates, and **`robots.txt`** pointing to it.
- **Open Graph and Twitter tags** with the translated title and description, and **JSON-LD** (`WebSite` and `WebPage` with `inLanguage`).

After the first deployment, submit the sitemap (`https://atdtn.github.io/llm-howto/sitemap.xml`) in Google Search Console and Bing Webmaster Tools to speed up indexing.

## How the demos work

The demos are deliberately **toy** models, and the page says so:

- Sections 01, 05 and 06 count word frequencies in a small built-in corpus (1-, 2- and 3-word patterns with back-off). This is a lookup table, not a neural network, but it produces a real probability distribution over next words, which is the same interface a large model exposes.
- Sections 02 (tokens), 03 (embedding map), 04 (attention) and 07 (learning) are illustrations. Their numbers are chosen for clarity and do not come from a trained model.
- Section 08 estimates parameter count and file size from the formula `12 · L · d² + 2 · V · d` at fp16 precision. It is an approximation.

Everything runs in the browser. The site is plain HTML, CSS and JavaScript; the only build step is the one that writes the language pages.

## Running it locally

Build the site (this creates `dist/`, one folder per language):

```bash
node scripts/build.js
```

Then serve `dist/` with any static server, for example:

```bash
python3 -m http.server 8000 -d dist
```

and visit <http://localhost:8000>. Serving over HTTP matters: the language switcher links to folders such as `/ru/`, which `file://` does not resolve.

### Tests

The core logic (tokenizer, n-gram model, temperature, generation, learning illustration, size estimate), the translations and the built pages (canonical, hreflang, sitemap) have unit tests built on Node's built-in test runner. Node 18 or newer is required.

```bash
node --test src/js/tests/*.test.js
```

## Deployment

The demo is published with GitHub Pages by `.github/workflows/pages.yml`: on every push to `main` the tests run, then `scripts/build.js` builds `dist/` and only that folder is deployed. In the repository settings, set **Pages → Source** to **GitHub Actions** once.

The canonical and sitemap addresses use `https://atdtn.github.io/llm-howto/`. To publish elsewhere, set `SITE_URL` when building, for example `SITE_URL=https://example.org/ node scripts/build.js`.

## Project layout

```
src/index.html          Page template; text marked with data-i18n keys
src/styles.css          Styling
src/logo.svg             Site logo (also the favicon)
src/js/theme.js         Appearance settings: mode (auto/light/dark) and palette, remembered in the browser
src/js/nav.js           Header: section menu, current-section highlight, reading progress
src/og/, src/*.png      Social preview images and icons, drawn by scripts/render-images.js
src/fonts/              Onest font for the site name (OFL license), self-hosted
src/js/i18n/*.js        Dictionaries: en (source), ru, de — page text, demo data, corpus
src/js/i18n.js          Translator for the demos (language from the page)
src/js/model.js         Tokenizer and n-gram model: counts, predictions, temperature, sampling
src/js/generation.js    Step-by-step text generation state machine
src/js/learn.js         Learning illustration
src/js/params.js        Model size estimate
src/js/embeddings.js    Word-map data and nearest neighbours
src/js/main.js          Builds the toy model from the page language's corpus and starts all demos
src/js/demo/*.js        One file per interactive section, wired to the page
src/js/tests/           Unit tests (including site build tests)
scripts/build.js        Builds dist/: one page per language, sitemap.xml, robots.txt
scripts/render-images.js  Redraws images and icons (needs playwright-core, see the file)
design/                 Palette and logo options (not deployed)
.github/workflows/      GitHub Pages deployment (tests, build, deploy)
```

## Contributing

Issues and pull requests are welcome. If you change a number or a claim, keep the caveats in step with it in every language: the demos are simplified on purpose, and the text says so.
