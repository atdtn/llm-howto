'use strict';

/*
 * Deutsch. Ключи совпадают с en.js и ru.js (проверяет js/tests/i18n.test.js).
 * Вариант «du» — как и русский текст, на «ты».
 */
(function (global) {
  const LOCALE = {
    code: 'de',
    name: 'Deutsch',
    htmlLang: 'de',
    intl: 'de-DE',

    text: {
      'meta.title': 'Wie Sprachmodelle funktionieren — anschaulich',
      'meta.description':
        'Eine interaktive Erklärung ohne Formeln: Ein Sprachmodell ist eine Maschine, die das nächste Wort errät. Neun kurze Abschnitte mit Demos zum Ausprobieren.',
      'github.label': 'Quellcode auf GitHub',
      'logo.label': 'Logo der Website',
      'settings.label': 'Darstellung',
      'settings.mode': 'Modus',
      'settings.mode.auto': 'Auto',
      'settings.mode.light': 'Hell',
      'settings.mode.dark': 'Dunkel',
      'settings.palette': 'Farben',
      'palette.amber': 'Bernstein',
      'palette.coral': 'Koralle',
      'palette.indigo': 'Indigo',
      'palette.sage': 'Salbei',
      'palette.paper': 'Papier',
      'og.alt': 'Wie Sprachmodelle funktionieren: eine interaktive Erklärung ohne Formeln',
      'brand.name': 'Wie LLMs funktionieren',
      'brand.home': 'Wie LLMs funktionieren — nach oben',
      'toc.menu': 'Abschnittsliste',
      'lang.label': 'Sprache',

      'hero.kicker': 'Eine Erklärung ohne Formeln',
      'hero.title': 'Wie Sprachmodelle<br>funktionieren',
      'hero.lead':
        'Chatbots, Übersetzer, die Autovervollständigung im Handy — das alles sind Sprachmodelle. Hier kannst du die Grundidee, auf der sie beruhen, selbst ausprobieren.',
      'hero.callout':
        'Die Hauptidee: Ein Modell ist eine Maschine, die das nächste Wort errät. Alles Weitere sind Details dieses Ratens.',

      'toc.label': 'Abschnitte',
      'toc.predict': 'Errate das nächste Wort',
      'toc.tokens': 'Tokens',
      'toc.context': 'Kontext',
      'toc.attention': 'Aufmerksamkeit',
      'toc.generate': 'Ein Token nach dem anderen',
      'toc.temperature': 'Temperatur',
      'toc.learn': 'Lernen',
      'toc.inside': 'Innenleben',
      'toc.finale': 'Fazit',

      'predict.title': 'Das Modell errät das nächste Wort',
      'predict.p1':
        'Ein Sprachmodell ist ein Programm, das Text liest und vorhersagt, welches Wort als Nächstes kommt. Wenn dein Handy dir das nächste Wort vorschlägt, hast du ein solches Modell schon bei der Arbeit gesehen. Ein großes Modell macht dasselbe, hat aber so viel Text gelesen, dass seine Vermutungen viel besser sind.',
      'predict.p2':
        'Probier es aus: Fang einen Satz an — darunter erscheinen die Wörter, die das Modell für wahrscheinlich hält. Die Balken zeigen die Wahrscheinlichkeit: Je länger der Balken, desto sicherer ist das Modell.',
      'predict.inputLabel': 'Fang einen Satz an',
      'predict.defaultInput': 'der Lebkuchenmann',
      'predict.bridge': 'Zuerst muss der Text aber in Zahlen verwandelt werden — dazu kommen wir gleich.',
      'predict.empty': 'Tippe los — dann erscheinen mögliche Fortsetzungen.',
      'predict.emptyInput': 'Noch nichts eingegeben — hier sind die häufigsten Wörter aus dem eingebauten Text.',
      'predict.unknown':
        'Diese Wortfolge steht nicht im eingebauten Text. Das Modell ist auf die häufigsten Wörter zurückgefallen — seine Art zu sagen: „Ich weiß es nicht.“',
      'predict.bigramShort': 'Das Modell kennt dieses Wort und weiß, was meistens danach kommt.',
      'predict.bigram':
        'Dieses Wortpaar hat das Modell nicht gesehen, aber es weiß, was auf das letzte Wort meistens folgt.',
      'predict.trigram': 'Das Modell kennt dieses Wortpaar und weiß, was meistens danach kommt.',
      'predict.fallback': 'So sieht das Modell seinen nächsten Schritt: Jedes Wort hat seine eigene Wahrscheinlichkeit.',

      'tokens.title': 'Das Modell sieht Tokens, keine Wörter',
      'tokens.p1':
        'Das Modell sieht keine ganzen Wörter, erst recht keine Buchstaben. Vor der Arbeit wird der Text in Stücke geschnitten — Tokens genannt. Oft entspricht ein Token einem Wort, manchmal ist es ein Wortteil oder ein Satzzeichen.',
      'tokens.p2':
        'Jedes Stück hat eine Nummer. Das Modell arbeitet mit Zahlen: Eine Textzeile wird zu einer Folge von Zahlen, und erst danach beginnt das Raten.',
      'tokens.inputLabel': 'Text',
      'tokens.defaultText': 'Hallo, Welt! Sprachmodelle lesen Texte in kleinen Stücken.',
      'tokens.count':
        'Tokens insgesamt: {count}. Die Nummern hier sind frei gewählt, und die Schneideregeln sind vereinfacht: Ein echtes Modell lernt seine Stücke beim Lesen von Texten selbst.',
      'tokens.empty': 'Gib einen Text ein, um die Tokens zu sehen.',
      'tokens.bridge': 'Die Zahlen allein tragen noch keinen Sinn: Der entsteht erst im Zusammenspiel mit anderen Wörtern.',

      'context.title': 'Die Bedeutung kommt aus dem Kontext',
      'context.p1':
        'Ein und dasselbe Wort kann Verschiedenes bedeuten. Das Modell erkennt, was gemeint ist, an den Wörtern drumherum.',
      'context.p2':
        'Das Wort „Schlüssel“ neben Tür und Schloss ist das Ding, mit dem man aufschließt. Neben Geige und Noten ist es das Zeichen am Anfang der Notenzeile. Für das Modell sind das zwei verschiedene Bedeutungen, und den Unterschied liefert der Kontext.',
      'context.tabsLabel': 'Kontexte des Wortes „Schlüssel“',
      'context.tab.door': 'Türschlüssel',
      'context.tab.music': 'Violinschlüssel',
      'context.neighborsLabel': 'Wörter, die das Modell für nah verwandt hält:',
      'context.note':
        'Das ist eine Veranschaulichung. Ein echtes Modell speichert die Bedeutung von Wörtern als Zahlenreihen und findet nahe Nachbarn selbst.',
      'context.subhead': 'Wie Bedeutung in Zahlen gespeichert wird',
      'context.p3':
        'Jedes Wort ersetzt das Modell durch eine Zahlenreihe — einen Vektor. Wörter mit ähnlicher Bedeutung bekommen ähnliche Vektoren. Deshalb liegt „Katze“ nahe bei „Kater“ und „Apfel“ nahe bei „Birne“.',
      'context.bridge': 'Eine Zahlenreihe ist nur der Anfang: Jetzt muss das Modell die Wörter miteinander verknüpfen.',
      'embeddings.mapLabel': 'Schematische Wortkarte',
      'embeddings.selected': 'Ausgewählt:',
      'embeddings.nearest': 'Nächste Wörter:',
      'embeddings.aria': 'Wort „{word}“',
      'embeddings.note':
        'Das ist eine schematische Ebene mit zwei Zahlen. Ein echtes Modell verwendet pro Wort Hunderte oder Tausende Zahlen, und der Kontext verändert diese Darstellung ständig.',

      'attention.title': 'Aufmerksamkeit verbindet die Wörter',
      'attention.p1':
        'Um einen Satz zu verstehen, muss das Modell die Wörter miteinander verbinden. Dieser Mechanismus heißt Aufmerksamkeit: Jedes Wort „schaut“ auf die anderen und entscheidet, welche davon für seine Bedeutung wichtig sind.',
      'attention.p2':
        'Fahr mit dem Mauszeiger über ein Wort, tippe es auf dem Handy an oder wähle es mit Tab aus — dann leuchten die Wörter auf, auf die es achtet. Das Bild ist vereinfacht: Bei einem echten Modell berechnen sich diese Verbindungen selbst, und es sind Millionen.',
      'attention.caption': 'Fahr mit dem Mauszeiger über ein Wort, tippe es an oder wähle es mit Tab.',
      'attention.focus': '„{word}“ schaut auf {list}.',
      'attention.item': '„{word}“ ({pct} %)',
      'attention.and': ' und ',
      'attention.ariaLabel': 'Zeigen, worauf „{word}“ schaut',
      'attention.bridge': 'Sind die Wörter verknüpft, kann das Modell das nächste Token wählen — und den Vorgang wiederholen.',

      'generate.title': 'Ein Token nach dem anderen',
      'generate.p1':
        'Das Modell schreibt nicht die ganze Antwort auf einmal. Es macht einen kleinen Schritt — wählt das nächste Wort — und hängt es an den Text an. Dann liest es alles bisher Geschriebene noch einmal und macht den nächsten Schritt.',
      'generate.p2':
        'Drück auf „Generieren“ und sieh zu, wie sich aus einzelnen Vermutungen ein Satz ergibt. Oder wähle das Wort selbst: Klick auf eine Option, und das Modell macht von dort weiter.',
      'generate.inputLabel': 'Anfang des Textes',
      'generate.defaultInput': 'es war',
      'generate.start': 'Generieren',
      'generate.more': '10 weitere',
      'generate.pause': 'Pause',
      'generate.resume': 'Weiter',
      'generate.reset': 'Zurücksetzen',
      'generate.note':
        '„10 weitere“ hängt genau zehn Wörter an: Das Spielzeugmodell kennt keine Satzzeichen und kann nicht am Punkt aufhören. Ein echtes Modell kann das.',
      'generate.autoPrompt': 'Das Modell wählt aus:',
      'generate.pickPrompt': 'Klick ein Wort, um selbst weiterzumachen:',
      'generate.noNext': 'Das Modell hat nichts mehr hinzuzufügen.',
      'generate.enough': 'Das reicht: Drück auf „Zurücksetzen“ und fang neu an.',
      'generate.pickAria': 'Das Wort „{word}“ wählen',
      'generate.bridge': 'Aus denselben Kandidaten lässt sich vorsichtiger oder mutiger wählen.',

      'temperature.title': 'Temperatur: vorsichtig oder mutig',
      'temperature.p1':
        'Das Modell hat immer eine Wahl: das wahrscheinlichste Wort nehmen oder ein weniger naheliegendes riskieren. Wie viel es riskiert, bestimmt die Temperatur.',
      'temperature.p2':
        'Niedrige Temperatur — vorhersehbar und vorsichtig. Hohe — mutiger und überraschender, manchmal aber seltsam. Schieb den Regler: Er verändert die mittlere Spalte.',
      'temperature.sliderLabel': 'Temperatur:',
      'temperature.cold': 'Temperatur {value}',
      'temperature.selected': 'Gewählt: {value}',
      'temperature.hot': 'Temperatur {value}',
      'temperature.sample': 'Beispiel: {tokens}',
      'temperature.note':
        'Gleicher Anfang, verschiedene Verteilungen. Links riskiert das Modell kaum etwas, rechts zieht es seltene Varianten in Betracht. Die Länge jedes Balkens ist die Wahrscheinlichkeit eines Wortes.',
      'temperature.prompt': 'Opa',
      'temperature.bridge': 'Woher kommen aber die Wahrscheinlichkeiten überhaupt? Sie werden beim Training eingestellt.',

      'learn.title': 'Wie das Modell lernt',
      'learn.p1':
        'Niemand gibt dem Modell fertige Regeln vor. Niemand schreibt hinein „Die Hauptstadt von Frankreich ist Paris“. Beim Training passt es seine Zahlen so an, dass richtige Fortsetzungen wahrscheinlicher und falsche seltener werden.',
      'learn.p2':
        'Unten stehen fünf erfundene Antworten. Am Anfang des Trainings unterscheidet das Modell die richtige kaum von den anderen. Schieb den Regler „Trainingsschritte“ und sieh zu, wie die Wahrscheinlichkeit für Paris wächst.',
      'learn.sliderLabel': 'Trainingsschritte:',
      'learn.answer': 'richtige Antwort',
      'learn.note':
        'Die Zahlen sind veranschaulichend: Das ist kein Protokoll echten Trainings, sondern ein Bild dafür, wie das Anpassen der Zahlen die Wahrscheinlichkeiten verschiebt. Ein echtes Modell hat Milliarden Parameter, und jeder Schritt bewegt alle davon.',
      'learn.bridge': 'Was genau wird beim Training angepasst? Schauen wir uns den Aufbau des Modells als Ganzes an.',

      'inside.title': 'Was drinsteckt',
      'inside.p1':
        'Innen ist das Modell eine lange Kette ähnlicher Blöcke. Alles, was es „weiß“, steckt in Zahlen — den Parametern. Klick auf eine Stufe, um zu sehen, was dort passiert.',
      'inside.stagesLabel': 'Stufen des Modells',
      'inside.p2':
        'Zwei Zahlen bestimmen die Größe eines Modells: wie viele Schichten es hat und wie breit seine Vektoren sind. Schieb die Regler — die Schätzungen werden neu berechnet.',
      'inside.presetsLabel': 'Modellgröße',
      'inside.preset.small': 'Klein',
      'inside.preset.medium': 'Mittel',
      'inside.preset.large': 'Groß',
      'inside.layers': 'Schichten:',
      'inside.width': 'Vektorbreite:',
      'inside.params': 'Parameter:',
      'inside.size': 'Dateigröße:',
      'inside.formulaSummary': 'Woher die Zahlen kommen',
      'inside.formula':
        'Schätzung: 12 · L · d² Parameter in den Blöcken plus 2 · V · d in den Embeddings und der Ausgabeschicht; L ist die Zahl der Schichten, d die Breite, V die Größe des Vokabulars (hier 50.000). Die Dateigröße ergibt sich aus 2 Byte pro Parameter (fp16).',
      'inside.formulaNote':
        'Das ist eine Vereinfachung: Echte Modelle haben weitere Komponenten, und ein laufendes Modell braucht mehr Speicher, als seine Gewichtsdatei groß ist.',
      'inside.note': 'Die Schätzung ist ungefähr. Gigabyte sind dezimal gerechnet, wie auf einer Festplattenverpackung.',
      'inside.bridge': 'Jetzt bringen wir alles in ein Bild — und erinnern uns an die wichtigste Einschränkung.',
      'stage.tok.name': 'Tokens',
      'stage.tok.tag': 'Eingabe',
      'stage.tok.text':
        'Der Text wird zu einer Folge von Nummern — Tokens. Ab hier arbeitet das Modell nur noch mit Nummern.',
      'stage.emb.name': 'Embedding',
      'stage.emb.tag': 'Bedeutung als Zahlen',
      'stage.emb.text': 'Jede Nummer wird zu einer Zahlenreihe — einem Vektor. Ähnliche Wörter bekommen ähnliche Reihen.',
      'stage.blk.name': 'Transformer-Blöcke, ×N',
      'stage.blk.tag': 'Hauptteil',
      'stage.blk.text':
        'Die Blöcke verfeinern die Darstellung der Wörter viele Male. Darin steckt die Aufmerksamkeit, die Informationen zwischen Wörtern weitergibt, und ein kleines Netz, das jedes Wort einzeln verarbeitet.',
      'stage.out.name': 'Ausgabeschicht',
      'stage.out.tag': 'Bewertungen',
      'stage.out.text': 'Für jedes mögliche nächste Token bekommt das Modell eine Bewertung: wie gut es passt.',
      'stage.sm.name': 'Softmax',
      'stage.sm.tag': 'Wahrscheinlichkeiten',
      'stage.sm.text':
        'Die Bewertungen werden zu Wahrscheinlichkeiten, die zusammen 100 % ergeben. Daraus wird das nächste Wort gewählt.',
      'units.bn': 'Mrd.',
      'units.mn': 'Mio.',
      'units.gb': 'GB',

      'finale.title': 'Und das war’s?',
      'finale.p1':
        'Im Grunde ja. Ein großes Modell unterscheidet sich von unserem Spielzeug durch den Maßstab: Es hat fast das ganze Internet gelesen und feine Verbindungen zwischen Wörtern gelernt. Das Prinzip ist aber dasselbe: das nächste Wort vorhersagen, anhängen, wiederholen.',
      'finale.p2':
        'Warum irrt es manchmal? Weil es Plausibles errät, nicht Wahres prüft. Eine überzeugend klingende Unwahrheit ist eine direkte Folge seines Aufbaus, kein Fehler im Betrieb.',
      'recap.title': 'Was man sich merken sollte',
      'recap.1': 'Das Modell sagt das nächste Wort anhand von Wahrscheinlichkeiten voraus.',
      'recap.2': 'Text wird in Tokens zerlegt, und das Modell arbeitet mit deren Nummern.',
      'recap.3': 'Die Bedeutung eines Wortes hängt vom Kontext ab, und die Aufmerksamkeit verbindet die Wörter.',
      'recap.4': 'Die Antwort entsteht Token für Token, Schritt für Schritt.',
      'recap.5': 'Die Temperatur bestimmt, wie viel Risiko das Modell bei der Auswahl eingeht.',
      'recap.6': 'Die Wahrscheinlichkeiten sind nicht von Anfang an festgelegt: Das Training stellt sie ein.',
      'recap.7': 'Das Wissen des Modells steckt in Zahlen-Parametern; Schichten und Breite bestimmen seine Größe.',

      'footer.text':
        'Die Demos 01, 05 und 06 zählen Worthäufigkeiten in einem kleinen eingebauten Text: Das ist ein Spielzeugmodell, kein neuronales Netz. Training, Wortkarte und Größenschätzung sind eigene Veranschaulichungen; ihre Zahlen sind der Deutlichkeit halber gewählt. Alles läuft im Browser — nach dem Laden der Seite wird kein Server mehr gebraucht.',
    },

    data: {
      contexts: {
        door: {
          before: 'Er zog den ',
          word: 'Schlüssel',
          after: ' aus der Tasche und öffnete die Tür.',
          neighbors: ['Schloss', 'Tür', 'Schlüsselloch', 'Wohnung', 'verlieren'],
        },
        music: {
          before: 'Am Anfang der Notenzeile steht der ',
          word: 'Violinschlüssel',
          after: '.',
          neighbors: ['Noten', 'Geige', 'Musik', 'Alt', 'Partitur'],
        },
      },
      embeddingLabels: {
        kot: 'Kater',
        koshka: 'Katze',
        pes: 'Hund',
        sobaka: 'Welpe',
        yabloko: 'Apfel',
        grusha: 'Birne',
        apelsin: 'Orange',
        banan: 'Banane',
      },
      attentionWords: ['Der Kater', 'der', 'saß', 'auf dem Fensterbrett', 'stieß', 'die Blume', 'um'],
      attentionNames: ['der Kater', 'der', 'saß', 'auf dem Fensterbrett', 'stieß', 'die Blume', 'um'],
      attentionCommaAfter: [0, 3],
      learnLabels: {
        paris: 'Paris',
        london: 'London',
        berlin: 'Berlin',
        madrid: 'Madrid',
        rome: 'Rom',
      },
    },

    corpus: `
Es war einmal ein Opa und eine Oma. Sie hatten ein kleines Huhn namens Ryaba.
Das Huhn legte ein Ei, und zwar kein gewöhnliches, sondern ein goldenes.
Opa schlug darauf, schlug und schlug, aber er zerbrach es nicht. Oma schlug darauf, schlug und schlug, aber sie zerbrach es nicht.
Eine Maus lief vorbei, wedelte mit dem Schwänzchen, und das Ei fiel herunter und zerbrach. Opa weinte, Oma weinte.
Aber das Huhn sagte: Weint nicht, Opa, weint nicht, Oma. Ich lege euch ein anderes Ei,
kein goldenes, sondern ein gewöhnliches.

Opa pflanzte eine Rübe. Die Rübe wuchs groß, riesengroß. Opa begann, sie aus der Erde zu ziehen.
Er zieht und zieht, aber er kann sie nicht herausziehen. Er rief die Oma. Die Oma hielt sich am Opa fest,
der Opa hielt sich an der Rübe fest. Sie ziehen und ziehen, aber sie können sie nicht herausziehen. Die Oma rief
die Enkelin. Die Enkelin hielt sich an der Oma fest, die Oma hielt sich am Opa fest,
der Opa hielt sich an der Rübe fest. Sie ziehen und ziehen, aber sie können sie nicht herausziehen. Die Enkelin
rief den Hund. Der Hund hielt sich an der Enkelin fest, die Enkelin hielt sich an der Oma fest,
die Oma hielt sich am Opa fest, der Opa hielt sich an der Rübe fest. Sie ziehen und ziehen, aber sie können sie nicht herausziehen.
Der Hund rief die Katze. Die Katze hielt sich am Hund fest, der Hund hielt sich an der Enkelin fest,
die Enkelin hielt sich an der Oma fest, die Oma hielt sich am Opa fest, der Opa hielt sich an der Rübe fest.
Sie ziehen und ziehen, aber sie können sie nicht herausziehen. Die Katze rief die Maus. Die Maus hielt sich an der Katze fest,
die Katze hielt sich am Hund fest, der Hund hielt sich an der Enkelin fest, die Enkelin hielt sich an der Oma fest,
die Oma hielt sich am Opa fest, der Opa hielt sich an der Rübe fest. Sie ziehen und ziehen, und endlich ziehen sie die Rübe heraus.

Die Oma backte einen Lebkuchenmann. Sie legte den Lebkuchenmann zum Abkühlen auf das Fensterbrett.
Der Lebkuchenmann lag eine Weile dort, dann rollte er davon. Er rollt die Straße entlang,
und ein Hase begegnet ihm. Der Hase sagt: Lebkuchenmann, Lebkuchenmann, ich fresse dich.
Der Lebkuchenmann antwortet: Friss mich nicht, Hase, ich singe dir ein Lied.
Ich bin der Lebkuchenmann, aus der Scheune gefegt, aus den Ecken gekratzt, in Sahne gerührt,
in den Ofen geschoben und am Fenster abgekühlt. Ich bin vom Opa fortgelaufen, ich bin von der Oma fortgelaufen,
und von dir, Hase, laufe ich auch fort.
Und der Lebkuchenmann rollte weiter. Ein Wolf begegnet ihm. Der Wolf sagt: Lebkuchenmann, Lebkuchenmann,
ich fresse dich. Friss mich nicht, Wolf, ich singe dir ein Lied. Und der Lebkuchenmann rollte weiter.
Ein Bär begegnet ihm. Der Bär sagt: Lebkuchenmann, Lebkuchenmann, ich fresse dich.
Friss mich nicht, Bär, ich singe dir ein Lied. Und der Lebkuchenmann rollte weiter.
Ein Fuchs begegnet ihm. Der Fuchs sagt: Lebkuchenmann, Lebkuchenmann, ich fresse dich.
Friss mich nicht, Fuchs, ich singe dir ein Lied. Der Fuchs sagt: Setz dich auf meine Nase und sing noch ein Lied.
Der Lebkuchenmann setzte sich auf die Nase des Fuchses, sang sein Lied, und der Fuchs schnappte zu — und fraß ihn auf.

Auf dem Feld steht ein kleines Haus. Ein Mäuschen läuft vorbei. Sie sieht das Häuschen und fragt:
Wer wohnt im Häuschen? Niemand antwortet. Das Mäuschen geht ins Häuschen und fängt an, dort zu wohnen.
Da hüpft ein Froschmädchen heran und fragt: Wer wohnt im Häuschen? Ich bin das Mäuschen, und wer bist du?
Ich bin der Frosch. Komm und wohne bei mir. Sie wohnen nun zu zweit. Da angelt ein Hase herbei.
Wer wohnt im Häuschen? Ich bin das Mäuschen, ich bin der Frosch, und wer bist du? Ich bin der Hase.
Komm zu uns wohnen. Sie wohnen nun zu dritt. Da kommt ein Füchslein. Sie wohnen nun zu viert.
Da angelt ein Wölfchen herbei. Sie wohnen nun zu fünft. Da kommt ein ungeschickter Bär.
Der Bär klettert auf das Häuschen und zerquetscht es.

Die Sonne scheint hell. Auf der Straße regnet es. Die Kinder spielen im Hof. Im Wald wachsen hohe Bäume.
Die Vögel singen Lieder. Am Himmel ziehen Wolken. Am Abend wird es kühl. Mama liest ein Buch.
Papa repariert das Fahrrad. Die Katze schläft auf dem Sofa. Der Hund läuft die Straße entlang. Im Fluss schwimmen Fische.
Im Herbst werden die Blätter gelb und fallen. Im Winter fällt der Schnee. Im Frühling kommen die Saatkrähen zurück. Im Sommer ist es sehr heiß.
Ich lese gern Bücher. Wir gehen zur Schule. Die Lehrerin erklärt die Stunde. Die Kinder hören aufmerksam zu.
Auf dem Tisch steht eine Tasse Tee. Im Zimmer ist es warm und gemütlich. Draußen weht der Wind. Nachts sind die Sterne am Himmel zu sehen.
Der Mond scheint ins Fenster. Morgens trinke ich Tee. Nachmittags spazieren wir im Park. Im Laden sind viele Leute.
Ich habe Brot und Milch gekauft. Oma backt Kuchen. Opa repariert die alte Uhr. Die Enkel helfen der Oma.
Die Familie sitzt am Tisch. Alle trinken Tee mit Marmelade. Die Katze sitzt am Fenster und schaut den Vögeln zu. Der Hund bewacht das Haus.
Die Kühe grasen auf der Wiese. Das Pferd läuft über das Feld. Im Garten wachsen Apfelbäume.
Auf dem Beet sind Gurken und Tomaten gewachsen. Im Herbst ernten wir. Die Vögel fliegen nach Süden.
Im Winter ist es still im Wald. Der Schnee liegt auf der Erde. Die Kinder fahren Schlitten. Im Sommer baden wir im Fluss.
Die Sonne geht hinter dem Wald unter. Es wird Abend. Alle gehen schlafen. Morgen wird ein neuer Tag sein.
`,
  };

  global.LLM_LOCALES = global.LLM_LOCALES || {};
  global.LLM_LOCALES[LOCALE.code] = LOCALE;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LOCALE;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
