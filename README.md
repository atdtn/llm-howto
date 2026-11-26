# How Language Models Work — Visually

[Читать на русском](README.ru.md)

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

## How the demos work

The demos are deliberately **toy** models, and the page says so:

- Sections 01, 05 and 06 count word frequencies in a small built-in Russian corpus (1-, 2- and 3-word patterns with back-off). This is a lookup table, not a neural network, but it produces a real probability distribution over next words, which is the same interface a large model exposes.
- Sections 02 (tokens), 03 (embedding map), 04 (attention) and 07 (learning) are illustrations. Their numbers are chosen for clarity and do not come from a trained model.
- Section 08 estimates parameter count and file size from the formula `12 · L · d² + 2 · V · d` at fp16 precision. It is an approximation.

The interface and the explanations are in Russian, since that is the primary audience for this version.

## Running it

There is no build step and no dependencies. The site is plain HTML, CSS and JavaScript, and works offline.

Either open the file directly:

```bash
xdg-open index.html   # Linux; on macOS use `open index.html`
```

or serve the folder with any static server, for example:

```bash
python3 -m http.server 8000
```

then visit <http://localhost:8000>.

### Tests

The core logic (tokenizer, n-gram model, temperature, generation, learning illustration, size estimate) has unit tests built on Node's built-in test runner. Node 18 or newer is required.

```bash
node --test js/tests/*.test.js
```

## Project layout

```
index.html        Page structure and text (in Russian)
styles.css        Styling
js/corpus.js      Built-in text the toy model learns from
js/model.js       Tokenizer and n-gram model: counts, predictions, temperature, sampling
js/generation.js  Step-by-step text generation
js/learn.js       Learning illustration
js/params.js      Model size estimate
js/embeddings.js  Word-map data
js/demo/*.js      One file per interactive section, wired to the page
js/main.js        Builds the toy model once and initialises all demos
js/tests/         Unit tests
```

## Contributing

Issues and pull requests are welcome. If you change a number or a claim, please keep the page's own caveats in step with it: the demos are simplified on purpose, and the text says so.
