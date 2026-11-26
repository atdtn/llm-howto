'use strict';

/*
 * English — основной язык и запасной вариант для всех остальных.
 * Ключи должны совпадать с ru.js и de.js (проверяет js/tests/i18n.test.js).
 */
(function (global) {
  const LOCALE = {
    code: 'en',
    name: 'English',
    htmlLang: 'en',
    intl: 'en-US',

    text: {
      'meta.title': 'How Language Models Work — Visually',
      'meta.description':
        'An interactive explainer without formulas: a language model is a machine that guesses the next word. Nine short sections with hands-on demos.',
      'github.label': 'View on GitHub',
      'logo.label': 'Site logo',
      'settings.label': 'Appearance',
      'settings.mode': 'Mode',
      'settings.mode.auto': 'Auto',
      'settings.mode.light': 'Light',
      'settings.mode.dark': 'Dark',
      'settings.palette': 'Colors',
      'palette.amber': 'Amber',
      'palette.coral': 'Coral',
      'palette.indigo': 'Indigo',
      'palette.sage': 'Sage',
      'palette.paper': 'Paper',
      'og.alt': 'How language models work: an interactive explainer without formulas',
      'brand.name': 'How LLMs work',
      'brand.home': 'How LLMs work — back to top',
      'toc.menu': 'Section list',
      'lang.label': 'Language',

      'hero.kicker': 'An explainer without formulas',
      'hero.title': 'How language<br>models work',
      'hero.lead':
        'Chatbots, translators, autocomplete on your phone — they are all language models. Here you can get hands-on with the core idea behind them.',
      'hero.callout':
        'The main idea: a model is a machine that guesses the next word. Everything else is detail on top of that guess.',

      'toc.label': 'Sections',
      'toc.predict': 'Guess the next word',
      'toc.tokens': 'Tokens',
      'toc.context': 'Context',
      'toc.attention': 'Attention',
      'toc.generate': 'One token at a time',
      'toc.temperature': 'Temperature',
      'toc.learn': 'Learning',
      'toc.inside': 'Inside',
      'toc.finale': 'Wrap-up',

      'predict.title': 'The model guesses the next word',
      'predict.p1':
        'A language model is a program that reads text and predicts which word comes next. When your phone suggests the next word, you have already seen a model like this at work. A large model does the same thing, but it has read so much text that its guesses are much better.',
      'predict.p2':
        'Try it: start a phrase, and the model will show the words it considers likely. The bars show probability: the longer the bar, the more confident the model is.',
      'predict.inputLabel': 'Start a phrase',
      'predict.defaultInput': 'the gingerbread',
      'predict.bridge': "But first the text has to be turned into numbers. We'll get to that next.",
      'predict.empty': 'Start typing — likely continuations will appear.',
      'predict.emptyInput': 'Nothing typed yet — these are the most common words in the built-in text.',
      'predict.unknown':
        'This phrase is not in the built-in text. The model fell back to the most common words — its way of saying “I don’t know”.',
      'predict.bigramShort': 'The model recognises this word and remembers what usually comes after it.',
      'predict.bigram':
        'The model has not seen this pair of words, but it remembers what tends to follow the last word.',
      'predict.trigram': 'The model recognises this pair of words and remembers what usually comes after it.',
      'predict.fallback': 'This is how the model sees its next step: every word has its own probability.',

      'tokens.title': 'The model sees tokens, not words',
      'tokens.p1':
        'The model does not see whole words, let alone letters. Before any work, the text is cut into pieces called tokens. A token often matches a word, but it can also be part of a word or a punctuation mark.',
      'tokens.p2':
        'Each piece has a number. The model works with numbers: a line of text becomes a sequence of numbers, and only then does the guessing begin.',
      'tokens.inputLabel': 'Text',
      'tokens.defaultText': 'Hello, world! Language models read text in pieces.',
      'tokens.count':
        'Total tokens: {count}. The numbers here are made up, and the cutting rules are simplified: a real model learns its own pieces from texts.',
      'tokens.empty': 'Type some text to see the tokens.',
      'tokens.bridge': 'The numbers alone do not carry meaning yet: meaning appears next to other words.',

      'context.title': 'Meaning comes from context',
      'context.p1':
        'The same word can mean different things. The model works out which meaning is meant from the words around it.',
      'context.p2':
        'The word “key” next to a door and a lock is the thing that opens the door. Next to a violin and sheet music, it is the sign at the start of a staff. For the model these are two different meanings, and the difference comes from context.',
      'context.tabsLabel': 'Contexts of the word “key”',
      'context.tab.door': 'a door key',
      'context.tab.music': 'a treble clef',
      'context.neighborsLabel': 'Words the model considers close:',
      'context.note':
        'This is an illustration. A real model stores word meanings as sets of numbers and finds close neighbours on its own.',
      'context.subhead': 'How meaning is stored in numbers',
      'context.p3':
        'The model replaces each word with a set of numbers called a vector. Words with similar meanings get similar vectors, so “cat” ends up near “kitten”, and “apple” near “pear”.',
      'context.bridge': 'A set of numbers is only the start: now the model has to link the words together.',
      'embeddings.mapLabel': 'A schematic word map',
      'embeddings.selected': 'Selected:',
      'embeddings.nearest': 'Nearest words:',
      'embeddings.aria': 'Word “{word}”',
      'embeddings.note':
        'This is a schematic plane with two numbers. A real model uses hundreds or thousands of numbers per word, and context keeps changing that representation.',

      'attention.title': 'Attention links the words together',
      'attention.p1':
        'To understand a sentence, the model has to connect its words to each other. This mechanism is called attention: each word “looks at” the others and decides which of them matter most for its meaning.',
      'attention.p2':
        'Hover over a word, tap it on a phone, or select it with Tab, and the words it attends to light up. The picture is simplified: in a real model these links are computed automatically, and there are millions of them.',
      'attention.caption': 'Hover over a word, tap it, or select it with Tab.',
      'attention.focus': '“{word}” looks at {list}.',
      'attention.item': '“{word}” ({pct}%)',
      'attention.and': ' and ',
      'attention.ariaLabel': 'Show what “{word}” looks at',
      'attention.bridge': 'Once the words are linked, the model can pick the next token — and repeat.',

      'generate.title': 'One token at a time',
      'generate.p1':
        "The model doesn't write the whole answer at once. It takes one small step — picks the next word — and adds it to the text. Then it looks at everything written so far again and takes the next step.",
      'generate.p2':
        'Press “Generate” and watch how separate guesses add up to a sentence. Or pick the word yourself: click one of the options, and the model continues from it.',
      'generate.inputLabel': 'Beginning of the text',
      'generate.defaultInput': 'once upon a',
      'generate.start': 'Generate',
      'generate.more': '10 more',
      'generate.pause': 'Pause',
      'generate.resume': 'Resume',
      'generate.reset': 'Reset',
      'generate.note':
        '“10 more” adds exactly ten words: the toy model knows no punctuation and cannot stop at a full stop. A real model can.',
      'generate.autoPrompt': 'The model picks from:',
      'generate.pickPrompt': 'Click a word to continue on your own:',
      'generate.noNext': 'The model has nothing to add.',
      'generate.enough': 'That is enough: press “Reset” and start again.',
      'generate.pickAria': 'Pick the word “{word}”',
      'generate.bridge': 'The same candidates can be picked more cautiously or more boldly.',

      'temperature.title': 'Temperature: cautious or bold',
      'temperature.p1':
        'The model always has a choice: take the most likely word, or risk a less obvious one. The temperature setting controls how much risk it takes.',
      'temperature.p2':
        'Low temperature — predictable and cautious. High — bolder and more surprising, but sometimes strange. Move the slider: it changes the middle column.',
      'temperature.sliderLabel': 'Temperature:',
      'temperature.cold': 'Temperature {value}',
      'temperature.selected': 'Selected: {value}',
      'temperature.hot': 'Temperature {value}',
      'temperature.sample': 'example: {tokens}',
      'temperature.note':
        'Same starting point, different distributions. On the left the model barely takes a risk; on the right it considers rare options. The length of each bar is the probability of a word.',
      'temperature.prompt': 'grandpa',
      'temperature.bridge':
        'But where do the probabilities come from in the first place? They are tuned during training.',

      'learn.title': 'How the model learns',
      'learn.p1':
        'No one hands the model ready-made rules. Nobody writes “the capital of France is Paris” into it. During training it adjusts its numbers so that correct continuations become more likely and wrong ones less likely.',
      'learn.p2':
        'Below are five imaginary answers. At the start of training the model barely tells the correct one from the rest. Move the “training steps” slider and watch the probability of Paris grow.',
      'learn.sliderLabel': 'Training steps:',
      'learn.answer': 'correct answer',
      'learn.note':
        'The numbers are illustrative: this is not a record of real training, but a picture of how adjusting the numbers shifts the probabilities. A real model has billions of parameters, and every step moves all of them.',
      'learn.bridge': "What exactly gets adjusted during training? Let's look at the model's structure as a whole.",

      'inside.title': "What's inside",
      'inside.p1':
        'Inside, the model is a long chain of similar blocks. Everything it “knows” is stored in numbers — parameters. Click a stage to see what happens there.',
      'inside.stagesLabel': 'Stages of the model',
      'inside.p2':
        'Two numbers set the size of a model: how many layers it has and how wide its vectors are. Move the sliders and the estimates are recalculated.',
      'inside.presetsLabel': 'Model size',
      'inside.preset.small': 'Small',
      'inside.preset.medium': 'Medium',
      'inside.preset.large': 'Large',
      'inside.layers': 'Layers:',
      'inside.width': 'Vector width:',
      'inside.params': 'Parameters:',
      'inside.size': 'File size:',
      'inside.formulaSummary': 'Where the numbers come from',
      'inside.formula':
        'Estimate: 12 · L · d² parameters in the blocks plus 2 · V · d in the embeddings and output layer, where L is the number of layers, d the width and V the vocabulary size (here 50,000). File size is 2 bytes per parameter (fp16).',
      'inside.formulaNote':
        'This is a simplification: real models have extra components, and a running model needs more memory than its weight file.',
      'inside.note': 'The estimate is approximate. Gigabytes are decimal, as on a disk label.',
      'inside.bridge': "Now let's put it all into one picture — and recall the main limitation.",
      'stage.tok.name': 'Tokens',
      'stage.tok.tag': 'input',
      'stage.tok.text':
        'The text is turned into a sequence of numbers — tokens. From here on the model works only with numbers.',
      'stage.emb.name': 'Embedding',
      'stage.emb.tag': 'meaning as numbers',
      'stage.emb.text': 'Each number is turned into a set of numbers — a vector. Similar words get similar sets.',
      'stage.blk.name': 'Transformer blocks, ×N',
      'stage.blk.tag': 'main part',
      'stage.blk.text':
        'The blocks refine the representation of words many times. Inside them is attention, which passes information between words, and a small network that processes each word separately.',
      'stage.out.name': 'Output layer',
      'stage.out.tag': 'scores',
      'stage.out.text': 'For every possible next token the model gets a score: how well it fits.',
      'stage.sm.name': 'Softmax',
      'stage.sm.tag': 'probabilities',
      'stage.sm.text':
        'The scores are turned into probabilities that add up to 100%. The next word is picked from them.',
      'units.bn': 'billion',
      'units.mn': 'million',
      'units.gb': 'GB',

      'finale.title': "And that's all?",
      'finale.p1':
        'More or less, yes. A large model differs from our toy in scale: it has read nearly the whole internet and learned to notice subtle links between words. But the principle is the same: predict the next word, add it, repeat.',
      'finale.p2':
        'Why does it sometimes get things wrong? Because it guesses what is plausible, not what is true. A convincing falsehood is a direct consequence of how it works, not a glitch.',
      'recap.title': 'What to remember',
      'recap.1': 'The model predicts the next word from probabilities.',
      'recap.2': 'Text is cut into tokens, and the model works with their numbers.',
      'recap.3': 'A word’s meaning depends on context, and attention links words together.',
      'recap.4': 'The answer is assembled one token per step.',
      'recap.5': 'Temperature decides how much risk the model takes when it chooses.',
      'recap.6': 'The probabilities are not set from the start: training tunes them.',
      'recap.7': 'The model’s knowledge is stored as numeric parameters; layers and width set its scale.',

      'footer.text':
        'Demos 01, 05 and 06 count word frequencies in a small built-in text: it is a toy model, not a neural network. Training, the word map and the size estimate are separate illustrations, with numbers chosen for clarity. Everything runs in your browser; after the page loads, no server is needed.',
    },

    data: {
      contexts: {
        door: {
          before: 'He took a ',
          word: 'key',
          after: ' out of his pocket and opened the door.',
          neighbors: ['lock', 'door', 'keyhole', 'apartment', 'lose'],
        },
        music: {
          before: 'At the start of the staff stands a ',
          word: 'treble clef',
          after: '.',
          neighbors: ['notes', 'violin', 'music', 'alto', 'score'],
        },
      },
      embeddingLabels: {
        kot: 'cat',
        koshka: 'kitten',
        pes: 'dog',
        sobaka: 'puppy',
        yabloko: 'apple',
        grusha: 'pear',
        apelsin: 'orange',
        banan: 'banana',
      },
      attentionWords: ['The cat', 'which', 'sat', 'on', 'the windowsill', 'knocked over', 'the flower'],
      attentionNames: ['the cat', 'which', 'sat', 'on', 'the windowsill', 'knocked over', 'the flower'],
      attentionCommaAfter: [0, 4],
      learnLabels: {
        paris: 'Paris',
        london: 'London',
        berlin: 'Berlin',
        madrid: 'Madrid',
        rome: 'Rome',
      },
    },

    corpus: `
Once upon a time there lived a grandpa and a grandma. They had a little hen called Ryaba.
The hen laid an egg, and not an ordinary one, but a golden one.
Grandpa hit it, hit it, but did not break it. Grandma hit it, hit it, but did not break it.
A mouse ran by, flicked its tail, and the egg fell and broke. Grandpa cried, grandma cried.
But the hen said: do not cry, grandpa, do not cry, grandma. I will lay you another egg,
not a golden one, but an ordinary one.

Grandpa planted a turnip. The turnip grew big, very, very big. Grandpa began to pull it out.
He pulls and pulls, but cannot pull it out. He called grandma. Grandma held on to grandpa,
grandpa held on to the turnip. They pull and pull, but cannot pull it out. Grandma called
the granddaughter. The granddaughter held on to grandma, grandma held on to grandpa,
grandpa held on to the turnip. They pull and pull, but cannot pull it out. The granddaughter
called the dog. The dog held on to the granddaughter, the granddaughter held on to grandma,
grandma held on to grandpa, grandpa held on to the turnip. They pull and pull, but cannot pull it out.
The dog called the cat. The cat held on to the dog, the dog held on to the granddaughter,
the granddaughter held on to grandma, grandma held on to grandpa, grandpa held on to the turnip.
They pull and pull, but cannot pull it out. The cat called the mouse. The mouse held on to the cat,
the cat held on to the dog, the dog held on to the granddaughter, the granddaughter held on to grandma,
grandma held on to grandpa, grandpa held on to the turnip. They pull and pull, and at last they pull it out.

The grandma baked a gingerbread man. She put the gingerbread man on the windowsill to cool.
The gingerbread man lay there for a while, and then he rolled away. He rolls along the road,
and a hare meets him. The hare says: gingerbread man, gingerbread man, I will eat you.
The gingerbread man answers: do not eat me, hare, I will sing you a song.
I am the gingerbread man, I was swept out of the barn, scraped out of the bins,
mixed with cream, put in the oven, and cooled on the windowsill. I ran away from grandpa,
I ran away from grandma, and from you too, hare, I will run away.
And the gingerbread man rolled on. A wolf meets him. The wolf says: gingerbread man, gingerbread man,
I will eat you. Do not eat me, wolf, I will sing you a song. And the gingerbread man rolled on.
A bear meets him. The bear says: gingerbread man, gingerbread man, I will eat you.
Do not eat me, bear, I will sing you a song. And the gingerbread man rolled on.
A fox meets him. The fox says: gingerbread man, gingerbread man, I will eat you.
Do not eat me, fox, I will sing you a song. The fox says: sit on my nose and sing one more song.
The gingerbread man sat on the fox’s nose, sang his song, and the fox snapped — and ate him up.

A little house stands in the field. A mouse runs past. She sees the little house and asks:
who lives in the little house? Nobody answers. The mouse goes into the little house and starts to live there.
A frog jumps up and asks: who lives in the little house? I am the mouse, and who are you?
I am the frog. Come and live with me. They live there together. A little bunny comes running.
Who lives in the little house? I am the mouse, I am the frog, and who are you? I am the bunny.
Come and live with us. They live there as three. A little fox comes. They live there as four.
A little wolf comes running. They live there as five. A clumsy bear comes along.
The bear climbs onto the little house and crushes it.

The sun shines brightly. It is raining on the street. The children play in the yard. In the forest
tall trees grow. Birds sing songs. Clouds float in the sky. In the evening it becomes cool.
Mum reads a book. Dad fixes the bicycle. The cat sleeps on the sofa. The dog runs along the road.
Fish swim in the river. In autumn the leaves turn yellow and fall. In winter the snow falls.
In spring the rooks come back. In summer it is very hot. I like to read books. We go to school.
The teacher explains the lesson. The children listen carefully. A cup of tea stands on the table.
In the room it is warm and cosy. Outside the window the wind howls. At night the stars are visible
in the sky. The moon shines into the window. In the morning I drink tea. In the afternoon we walk
in the park. There are many people in the shop. I bought bread and milk. Grandma bakes pies.
Grandpa fixes the old clock. The grandchildren help grandma. The family gathers at the table.
Everyone drinks tea with jam. The cat sits by the window and watches the birds. The dog guards the house.
The cows graze in the meadow. The horse runs across the field. Apple trees grow in the garden.
Cucumbers and tomatoes grew in the bed. In autumn we gather the harvest. The birds fly south.
In winter the forest is quiet. Snow lies on the ground. The children ride on sledges.
In summer we swim in the river. The sun sets behind the forest. Evening comes. Everyone goes to sleep.
Tomorrow will be a new day.
`,
  };

  global.LLM_LOCALES = global.LLM_LOCALES || {};
  global.LLM_LOCALES[LOCALE.code] = LOCALE;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LOCALE;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
