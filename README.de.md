# Wie Sprachmodelle funktionieren — anschaulich

**Live-Demo:** <https://atdtn.github.io/llm-howto/>

Sprachen: [English](README.md) · [Русский](README.ru.md) · **Deutsch**

Eine interaktive Erklärung ohne Formeln zur Grundidee hinter Chatbots, Übersetzern und Autovervollständigung: **Ein Sprachmodell ist eine Maschine, die das nächste Wort errät.** Alles Weitere sind Details dieses Ratens.

Die Seite hat neun kurze Abschnitte. Jeder enthält eine kleine Demo zum Ausprobieren: Man sieht die Ideen in Aktion, statt sie glauben zu müssen.

## Inhalt

| Nr. | Abschnitt | Idee |
|-----|-----------|------|
| 01 | Errate das nächste Wort | Das Modell weist jedem möglichen nächsten Wort eine Wahrscheinlichkeit zu. |
| 02 | Tokens | Der Text wird in Stücke (Tokens) zerlegt, und das Modell rechnet mit deren Nummern. |
| 03 | Kontext | Die Bedeutung eines Wortes ergibt sich aus den Wörtern drumherum und steht als Zahlenreihe da. |
| 04 | Aufmerksamkeit | Jedes Wort „schaut“ auf die anderen und entscheidet, welche für seine Bedeutung wichtig sind. |
| 05 | Ein Token nach dem anderen | Die Antwort entsteht Schritt für Schritt; bei jedem Schritt wird der bisherige Text neu betrachtet. |
| 06 | Temperatur | Ein Regler, der bestimmt, wie vorsichtig oder mutig die Wahl des nächsten Tokens ausfällt. |
| 07 | Lernen | Die Wahrscheinlichkeiten werden nicht von Hand festgelegt; das Training passt die Zahlen an. |
| 08 | Innenleben | Die Stufen der Verarbeitung und wie die Größe des Modells von Schichten und Breite abhängt. |
| 09 | Und das war’s? | Dasselbe Prinzip in viel größerem Maßstab und warum Modelle manchmal überzeugend klingen und dennoch irren. |

## Für wen

Für alle, die Sprachmodelle täglich nutzen und eine anschauliche Vorstellung davon bekommen möchten, was dahintersteckt — ohne lineare Algebra oder Vorkenntnisse im maschinellen Lernen.

## Sprachen

Die Seite gibt es in drei Sprachen, jede unter einer eigenen Adresse:

| Sprache | Adresse |
|---------|---------|
| English (Standard) | `/` |
| Русский | `/ru/` |
| Deutsch | `/de/` |

Der Umschalter oben auf der Seite wechselt zwischen ihnen. Jede Sprache hat ihren eigenen Text und ihr eigenes eingebautes Korpus, sodass die Demos mit Wörtern arbeiten, die in dieser Sprache natürlich sind. Die deutsche Fassung hat zum Beispiel eigene Märchen, eine eigene Wortkarte und ihre eigenen Umlaute.

Die Seiten leiten nicht anhand der Browsersprache um: Jede Adresse zeigt immer dieselbe Sprache, so wie es Suchmaschinen und geteilte Links brauchen.

### So sind die Übersetzungen aufgebaut

- `src/index.html` enthält den Aufbau der Seite. Texte sind mit `data-i18n`-Attributen markiert, die einen Schlüssel nennen.
- `src/js/i18n/en.js`, `ru.js` und `de.js` sind die Wörterbücher: Seitentexte, Demo-Texte, Beispieldaten und das Korpus jeder Sprache.
- `scripts/build.js` erzeugt für jede Sprache eine statische Seite: Er setzt den übersetzten Text ein, sodass der Inhalt im HTML steht und nicht erst von JavaScript ergänzt wird.
- `src/js/i18n.js` ist der kleine Übersetzer, den die Demos im Browser nutzen; die Sprache liest er aus dem Attribut `data-lang` der Seite.
- `src/js/tests/i18n.test.js` prüft, dass alle Sprachen dieselben Schlüssel und Platzhalter haben. Eine fehlende Übersetzung lässt die Tests scheitern, statt still Englisch anzuzeigen.

Um eine Sprache hinzuzufügen, kopiere `src/js/i18n/en.js` nach `src/js/i18n/<Code>.js` und übersetze sie. Dann ergänze den Code in `LANGS` in `scripts/build.js`, eine Bezeichnung in `languageSwitcher()` dort und das neue Wörterbuch in den Listen von `src/js/tests/i18n.test.js` und `src/js/tests/site.test.js`. Die Tests zeigen, was fehlt.

## Suchmaschinenoptimierung (SEO)

Jede Sprache hat eine eigene Seite, sodass Suchmaschinen alle drei indexieren können:

- **Statisches HTML pro Sprache** — der übersetzte Text steht im Markup; Crawler müssen kein JavaScript ausführen.
- **`<html lang>`** mit der Sprache der Seite.
- **`rel="canonical"`** auf jeder Seite.
- **`hreflang`-Alternativen** für `en`, `ru` und `de`, dazu `x-default` für die englische Seite.
- **`sitemap.xml`** mit allen Sprachseiten und ihren Alternativen sowie **`robots.txt`** mit Verweis darauf.
- **Open-Graph- und Twitter-Tags** mit dem übersetzten Titel und der Beschreibung sowie **JSON-LD** (`WebSite` und `WebPage` mit `inLanguage`).

Nach der ersten Veröffentlichung reiche die Sitemap (`https://atdtn.github.io/llm-howto/sitemap.xml`) in der Google Search Console und den Bing Webmaster Tools ein, damit die Indexierung schneller geht.

## So funktionieren die Demos

Die Demos laufen bewusst auf einem **Spielzeugmodell**, und die Seite sagt das auch:

- Die Abschnitte 01, 05 und 06 zählen Worthäufigkeiten in einem kleinen eingebauten Korpus (Muster aus einem, zwei und drei Wörtern mit Rückgriff auf kürzere). Das ist eine Nachschlagetabelle, kein neuronales Netz; sie liefert aber eine echte Wahrscheinlichkeitsverteilung für das nächste Wort — dieselbe Schnittstelle, die auch ein großes Modell bietet.
- Die Abschnitte 02 (Tokens), 03 (Wortkarte), 04 (Aufmerksamkeit) und 07 (Lernen) sind Veranschaulichungen. Ihre Zahlen sind der Deutlichkeit halber gewählt und stammen nicht aus einem trainierten Modell.
- Abschnitt 08 schätzt Parameterzahl und Dateigröße mit der Formel `12 · L · d² + 2 · V · d` bei fp16-Genauigkeit. Das ist eine Näherung.

Alles läuft im Browser. Die Seite ist einfaches HTML, CSS und JavaScript; der einzige Build-Schritt erzeugt die Sprachseiten.

## Lokal starten

Baue die Seite (dabei entsteht `dist/` mit einem Ordner pro Sprache):

```bash
node scripts/build.js
```

Dann stelle `dist/` mit einem beliebigen statischen Server bereit, zum Beispiel:

```bash
python3 -m http.server 8000 -d dist
```

und rufe <http://localhost:8000> auf. Wichtig ist HTTP: Der Umschalter verlinkt auf Ordner wie `/ru/`, die `file://` nicht auflöst.

### Tests

Die Kernlogik (Tokenizer, n-Gramm-Modell, Temperatur, Generierung, Lern-Veranschaulichung, Größenschätzung), die Übersetzungen und die gebauten Seiten (canonical, hreflang, Sitemap) sind mit Unit-Tests abgedeckt, die auf dem eingebauten Testrunner von Node laufen. Node 22 oder neuer ist nötig (CI nutzt Node 24).

```bash
node --test src/js/tests/*.test.js
```

## Veröffentlichung

Die Demo wird über `.github/workflows/pages.yml` auf GitHub Pages veröffentlicht: Bei jedem Push auf `main` laufen zuerst die Tests, danach baut `scripts/build.js` den Ordner `dist/`, und nur dieser Ordner wird veröffentlicht. Einmalig in den Repository-Einstellungen **Pages → Source: GitHub Actions** wählen.

Die Adressen für canonical und Sitemap nutzen `https://atdtn.github.io/llm-howto/`. Für eine andere Adresse setze beim Bauen `SITE_URL`, zum Beispiel `SITE_URL=https://example.org/ node scripts/build.js`.

## Projektstruktur

```
src/index.html          Seitenvorlage; Texte mit data-i18n-Schlüsseln markiert
src/styles.css          Styles
src/logo.svg             Logo der Website (zugleich Favicon)
src/js/theme.js         Darstellung: Modus (auto/hell/dunkel) und Farbpalette, wird im Browser gemerkt
src/js/nav.js           Kopfzeile: Abschnittsmenü, aktueller Abschnitt, Lesefortschritt
src/og/, src/*.png      Vorschaubilder für soziale Netzwerke und Icons, erzeugt von scripts/render-images.js
src/fonts/              Schrift Onest für den Seitennamen (OFL-Lizenz), lokal eingebunden
src/js/i18n/*.js        Wörterbücher: en (Quelle), ru, de — Seitentexte, Demo-Daten, Korpus
src/js/i18n.js          Übersetzer für die Demos (Sprache von der Seite)
src/js/model.js         Tokenizer und n-Gramm-Modell: Zählung, Vorhersagen, Temperatur, Auswahl
src/js/generation.js    Schrittweise Textgenerierung
src/js/learn.js         Lern-Veranschaulichung
src/js/params.js        Größenschätzung des Modells
src/js/embeddings.js    Daten der Wortkarte und nächste Nachbarn
src/js/main.js          Baut das Modell aus dem Korpus der Seitensprache und startet die Demos
src/js/demo/*.js        Eine Datei pro interaktivem Abschnitt
src/js/tests/           Unit-Tests (auch für den Seitenbau)
scripts/build.js        Baut dist/: eine Seite pro Sprache, sitemap.xml, robots.txt
scripts/render-images.js  Zeichnet Bilder und Icons neu (braucht playwright-core, siehe Datei)
design/                 Varianten für Paletten und Logo (wird nicht veröffentlicht)
.github/workflows/      Veröffentlichung auf GitHub Pages (Tests, Build, Deployment)
```

## Lizenz

- **Code** (scripts/, src/js/, Markup und Styles, CI): [MIT](LICENSE).
- **Texte, Illustrationen und Logo** (Erklär- und Demotexte in `src/js/i18n/*.js`, die READMEs, `src/logo.svg`, Icons, `src/og/`, `design/`): [CC BY 4.0](LICENSE-CONTENT). Sie dürfen sie weiterverwenden und bearbeiten, auch kommerziell, mit Namensnennung: „How Language Models Work — Visually“ von atdtn, https://github.com/atdtn/llm-howto, CC BY 4.0.
- **Schrift Onest** in `src/fonts/`: [SIL Open Font License 1.1](src/fonts/OFL.txt).

## Mitmachen

Hinweise und Pull Requests sind willkommen. Wenn du eine Zahl oder eine Aussage änderst, halte die Einschränkungen in allen Sprachen passend: Die Demos sind bewusst vereinfacht, und der Text sagt das auch.
