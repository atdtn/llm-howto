'use strict';

/*
 * Slovenčina. Ключи совпадают с en.js и ru.js (проверяет js/tests/i18n.test.js).
 * Как и русский и немецкий текст, обращение на «ты».
 */
(function (global) {
  const LOCALE = {
    code: 'sk',
    name: 'Slovenčina',
    htmlLang: 'sk',
    intl: 'sk-SK',

    text: {
      'meta.title': 'Ako fungujú jazykové modely — názorne',
      'meta.description':
        'Interaktívne vysvetlenie bez vzorcov: jazykový model je stroj, ktorý háda ďalšie slovo. Deväť krátkych častí s ukážkami, ktoré si môžeš vyskúšať.',
      'github.label': 'Zdrojový kód na GitHube',
      'logo.label': 'Logo stránky',
      'settings.label': 'Vzhľad',
      'settings.mode': 'Režim',
      'settings.mode.auto': 'Auto',
      'settings.mode.light': 'Svetlý',
      'settings.mode.dark': 'Tmavý',
      'settings.palette': 'Farby',
      'palette.amber': 'Jantár',
      'palette.coral': 'Korál',
      'palette.indigo': 'Indigo',
      'palette.sage': 'Šalvia',
      'palette.paper': 'Papier',
      'og.alt': 'Ako fungujú jazykové modely: interaktívne vysvetlenie bez vzorcov',
      'brand.name': 'Ako fungujú LLM',
      'brand.home': 'Ako fungujú LLM — na začiatok',
      'a11y.skip': 'Na obsah',
      'noscript.text': 'Interaktívne ukážky potrebujú JavaScript. Text vysvetlenia funguje aj bez neho.',
      'lang.label': 'Jazyk',

      'hero.kicker': 'Vysvetlenie bez vzorcov',
      'hero.title': 'Ako fungujú<br>jazykové modely',
      'hero.lead':
        'Chatboty, prekladače, automatické dopĺňanie v mobile — to všetko sú jazykové modely. Tu si môžeš sám vyskúšať základnú myšlienku, na ktorej stoja.',
      'hero.callout':
        'Hlavná myšlienka: model je stroj, ktorý háda ďalšie slovo. Všetko ostatné sú len detaily tohto hádania.',

      'toc.label': 'Časti',
      'toc.predict': 'Uhádni ďalšie slovo',
      'toc.tokens': 'Tokeny',
      'toc.context': 'Kontext',
      'toc.attention': 'Pozornosť',
      'toc.generate': 'Token po tokene',
      'toc.temperature': 'Teplota',
      'toc.learn': 'Učenie',
      'toc.inside': 'Vnútro modelu',
      'toc.finale': 'Záver',

      'demo.startsLabel': 'Začni slovom:',
      'tokens.examplesLabel': 'Príklady:',
      'predict.back': 'Odobrať slovo',
      'predict.clear': 'Odznova',
      'predict.addPrefix': 'Pridať slovo',
      'predict.title': 'Model háda ďalšie slovo',
      'predict.p1':
        'Jazykový model je program, ktorý číta text a predpovedá, aké slovo príde ďalej. Ak ti mobil navrhuje ďalšie slovo, takýto model si už videl pri práci. Veľký model robí to isté, len prečítal toľko textu, že jeho odhady sú oveľa lepšie.',
      'predict.p2':
        'Vyskúšaj si to: začni vetu alebo ťukni na hotový začiatok — pod ním sa objavia slová, ktoré model považuje za pravdepodobné. Ťuknutím na slovo ho pridáš k vete. Pásiky ukazujú pravdepodobnosť: čím dlhší pásik, tým je si model istejší.',
      'predict.inputLabel': 'Začni vetu',
      'predict.defaultInput': 'dedko',
      'predict.bridge': 'Najprv však treba text premeniť na čísla — k tomu sa hneď dostaneme.',
      'predict.empty': 'Začni písať — objavia sa možné pokračovania.',
      'predict.emptyInput': 'Zatiaľ nič nie je napísané — tu sú najčastejšie slová zo vstavaného textu.',
      'predict.unknown':
        'Takéto slová vo vstavanom texte nie sú. Model sa vrátil k najčastejším slovám — takto hovorí „neviem“.',
      'predict.bigramShort': 'Model toto slovo pozná a vie, čo po ňom zvyčajne nasleduje.',
      'predict.bigram':
        'Túto dvojicu slov model nevidel, ale vie, čo zvyčajne nasleduje po poslednom slove.',
      'predict.trigram': 'Model túto dvojicu slov pozná a vie, čo po nej zvyčajne nasleduje.',
      'predict.fallback': 'Takto model vidí svoj ďalší krok: každé slovo má vlastnú pravdepodobnosť.',

      'tokens.title': 'Model vidí tokeny, nie slová',
      'tokens.p1':
        'Model nevidí celé slová, a už vôbec nie písmená. Pred prácou sa text rozreže na kúsky — tokeny. Často je token jedno slovo, niekedy časť slova alebo interpunkčné znamienko.',
      'tokens.p2':
        'Každý kúsok má svoje číslo. Model pracuje s číslami: riadok textu sa zmení na postupnosť čísel a až potom sa začína hádanie.',
      'tokens.inputLabel': 'Text',
      'tokens.defaultText': 'Ahoj, svet! Jazykové modely čítajú text po kúskoch.',
      'tokens.count':
        'Počet tokenov: {count}. Čísla sú tu zvolené ľubovoľne a pravidlá rezania sú zjednodušené: skutočný model sa svoje kúsky naučí sám pri čítaní textov.',
      'tokens.empty': 'Napíš text a uvidíš tokeny.',
      'tokens.bridge': 'Samotné čísla ešte nenesú význam: ten vzniká až spolu s ostatnými slovami.',

      'context.title': 'Význam prichádza z kontextu',
      'context.p1':
        'To isté slovo môže znamenať rôzne veci. Model pozná, čo je myslené, podľa slov okolo.',
      'context.p2':
        'Slovo „kľúč“ vedľa dverí a zámky je vec, ktorou odomykáme. Vedľa husieľ a nôt je to znak na začiatku notovej osnovy. Pre model sú to dva rôzne významy a rozdiel mu dáva kontext.',
      'context.tabsLabel': 'Kontexty slova „kľúč“',
      'context.tab.door': 'Kľúč od dverí',
      'context.tab.music': 'Husľový kľúč',
      'context.neighborsLabel': 'Slová, ktoré model považuje za blízke:',
      'context.note':
        'Toto je ilustrácia. Skutočný model si význam slov ukladá ako rady čísel a blízkych susedov si nájde sám.',
      'context.subhead': 'Ako sa význam ukladá do čísel',
      'context.p3':
        'Každé slovo model nahradí radom čísel — vektorom. Slová s podobným významom dostanú podobné vektory. Preto je „mačka“ blízko „kocúra“ a „jablko“ blízko „hrušky“.',
      'context.bridge': 'Rad čísel je len začiatok: teraz musí model prepojiť slová medzi sebou.',
      'embeddings.mapLabel': 'Schematická mapa slov',
      'embeddings.selected': 'Vybrané:',
      'embeddings.nearest': 'Najbližšie slová:',
      'embeddings.aria': 'Slovo „{word}“',
      'embeddings.note':
        'Toto je schematická rovina s dvoma číslami. Skutočný model používa pre každé slovo stovky až tisíce čísel a kontext toto zobrazenie neustále mení.',

      'attention.title': 'Pozornosť spája slová',
      'attention.p1':
        'Aby model pochopil vetu, musí slová prepojiť medzi sebou. Tento mechanizmus sa volá pozornosť: každé slovo sa „pozerá“ na ostatné a rozhoduje, ktoré z nich sú pre jeho význam dôležité.',
      'attention.p2':
        'Prejdi kurzorom nad slovo, ťukni naň v mobile alebo ho vyber klávesom Tab — rozsvietia sa slová, na ktoré dáva pozor. Obrázok je zjednodušený: v skutočnom modeli sa takéto väzby počítajú samy a sú ich milióny.',
      'attention.caption': 'Prejdi kurzorom nad slovo, ťukni naň alebo ho vyber klávesom Tab.',
      'attention.focus': '„{word}“ sa pozerá na {list}.',
      'attention.item': '„{word}“ ({pct} %)',
      'attention.and': ' a ',
      'attention.ariaLabel': 'Ukázať, na čo sa pozerá slovo „{word}“',
      'attention.bridge': 'Keď sú slová prepojené, model môže vybrať ďalší token — a celé to zopakovať.',

      'generate.title': 'Jeden token za druhým',
      'generate.p1':
        'Model nepíše celú odpoveď naraz. Urobí malý krok — vyberie ďalšie slovo — a pridá ho k textu. Potom znova prečíta všetko, čo je doteraz napísané, a urobí ďalší krok.',
      'generate.p2':
        'Stlač „Generovať“ a sleduj, ako z jednotlivých odhadov vzniká veta. Alebo si slovo vyber sám: klikni na možnosť a model bude pokračovať odtiaľ.',
      'generate.inputLabel': 'Začiatok textu',
      'generate.defaultInput': 'mačka',
      'generate.start': 'Generovať',
      'generate.more': 'Ďalších 10',
      'generate.pause': 'Pauza',
      'generate.resume': 'Pokračovať',
      'generate.reset': 'Vynulovať',
      'generate.note':
        '„Ďalších 10“ pridá presne desať slov: hračkársky model nepozná interpunkciu a nevie skončiť pri bodke. Skutočný model to vie.',
      'generate.autoPrompt': 'Model vyberá z:',
      'generate.pickPrompt': 'Klikni na slovo a pokračuj sám:',
      'generate.noNext': 'Model už nemá čo pridať.',
      'generate.enough': 'To stačí: stlač „Vynulovať“ a začni odznova.',
      'generate.pickPrefix': 'Vybrať slovo',
      'generate.bridge': 'Z tých istých kandidátov sa dá vyberať opatrnejšie alebo odvážnejšie.',

      'temperature.title': 'Teplota: opatrne alebo odvážne',
      'temperature.p1':
        'Model má vždy na výber: vziať najpravdepodobnejšie slovo, alebo riskovať menej očividné. Koľko riskuje, určuje teplota.',
      'temperature.p2':
        'Nízka teplota — predvídateľne a opatrne. Vysoká — odvážnejšie a prekvapivejšie, niekedy však čudne. Posuň jazdec: mení stredný stĺpec.',
      'temperature.sliderLabel': 'Teplota:',
      'temperature.cold': 'Teplota {value}',
      'temperature.selected': 'Vybrané: {value}',
      'temperature.hot': 'Teplota {value}',
      'temperature.sample': 'Príklad: {tokens}',
      'temperature.note':
        'Rovnaký začiatok, rôzne rozdelenia. Vľavo model skoro neriskuje, vpravo zvažuje aj zriedkavé možnosti. Dĺžka každého pásika je pravdepodobnosť slova.',
      'temperature.prompt': 'dedko',
      'temperature.bridge': 'Odkiaľ sa však pravdepodobnosti vôbec berú? Nastavujú sa pri učení.',

      'learn.title': 'Ako sa model učí',
      'learn.p1':
        'Nikto modelu nedáva hotové pravidlá. Nikto doň nenapíše „Hlavné mesto Francúzska je Paríž“. Pri učení si upravuje svoje čísla tak, aby správne pokračovania boli pravdepodobnejšie a nesprávne zriedkavejšie.',
      'learn.p2':
        'Nižšie je päť vymyslených odpovedí. Na začiatku učenia model správnu odpoveď od ostatných takmer nerozlišuje. Posuň jazdec „Kroky učenia“ a sleduj, ako pravdepodobnosť Paríža rastie.',
      'learn.sliderLabel': 'Kroky učenia:',
      'learn.answer': 'správna odpoveď',
      'learn.note':
        'Čísla sú ilustračné: nie je to záznam skutočného učenia, ale obrázok toho, ako úprava čísel posúva pravdepodobnosti. Skutočný model má miliardy parametrov a každý krok pohne všetkými.',
      'learn.bridge': 'Čo presne sa pri učení upravuje? Pozrime sa na stavbu modelu ako celku.',

      'inside.title': 'Čo je vnútri',
      'inside.p1':
        'Vnútri je model dlhá reťaz podobných blokov. Všetko, čo „vie“, je uložené v číslach — parametroch. Klikni na stupeň a uvidíš, čo sa tam deje.',
      'inside.stagesLabel': 'Stupne modelu',
      'inside.p2':
        'Veľkosť modelu určujú dve čísla: koľko má vrstiev a aké široké sú jeho vektory. Posuň jazdce — odhady sa prepočítajú.',
      'inside.presetsLabel': 'Veľkosť modelu',
      'inside.preset.small': 'Malý',
      'inside.preset.medium': 'Stredný',
      'inside.preset.large': 'Veľký',
      'inside.layers': 'Vrstvy:',
      'inside.width': 'Šírka vektora:',
      'inside.params': 'Parametre:',
      'inside.size': 'Veľkosť súboru:',
      'inside.formulaSummary': 'Odkiaľ sú tieto čísla',
      'inside.formula':
        'Odhad: 12 · L · d² parametrov v blokoch plus 2 · V · d v embeddingoch a výstupnej vrstve; L je počet vrstiev, d šírka, V veľkosť slovníka (tu 50 000). Veľkosť súboru vychádza z 2 bajtov na parameter (fp16).',
      'inside.formulaNote':
        'Je to zjednodušenie: skutočné modely majú ďalšie súčasti a bežiaci model potrebuje viac pamäte, než je veľkosť súboru s váhami.',
      'inside.note': 'Odhad je približný. Gigabajty sú počítané desiatkovo, ako na obale disku.',
      'inside.bridge': 'Teraz to všetko spojíme do jedného obrázka — a pripomenieme si najdôležitejšie obmedzenie.',
      'stage.tok.name': 'Tokeny',
      'stage.tok.tag': 'vstup',
      'stage.tok.text':
        'Text sa zmení na postupnosť čísel — tokenov. Odtiaľto model pracuje už len s číslami.',
      'stage.emb.name': 'Embedding',
      'stage.emb.tag': 'význam v číslach',
      'stage.emb.text': 'Každé číslo sa zmení na rad čísel — vektor. Podobné slová dostanú podobné rady.',
      'stage.blk.name': 'Bloky transformera, ×N',
      'stage.blk.tag': 'hlavná časť',
      'stage.blk.text':
        'Bloky mnohokrát spresňujú zobrazenie slov. Vnútri je pozornosť, ktorá prenáša informácie medzi slovami, a malá sieť, ktorá spracúva každé slovo zvlášť.',
      'stage.out.name': 'Výstupná vrstva',
      'stage.out.tag': 'hodnotenia',
      'stage.out.text': 'Pre každý možný ďalší token model dostane hodnotenie: ako dobre sa hodí.',
      'stage.sm.name': 'Softmax',
      'stage.sm.tag': 'pravdepodobnosti',
      'stage.sm.text':
        'Hodnotenia sa zmenia na pravdepodobnosti, ktoré spolu dávajú 100 %. Z nich sa vyberá ďalšie slovo.',
      'units.bn': 'mld.',
      'units.mn': 'mil.',
      'units.gb': 'GB',

      'finale.title': 'A to je všetko?',
      'finale.p1':
        'V podstate áno. Veľký model sa od našej hračky líši mierkou: prečítal takmer celý internet a naučil sa jemné väzby medzi slovami. Princíp je však rovnaký: predpovedať ďalšie slovo, pridať ho, zopakovať.',
      'finale.p2':
        'Prečo sa niekedy mýli? Pretože háda pravdepodobné, neoveruje pravdivé. Presvedčivo znejúca nepravda je priamy dôsledok jeho stavby, nie porucha.',
      'recap.title': 'Čo si zapamätať',
      'recap.1': 'Model predpovedá ďalšie slovo podľa pravdepodobností.',
      'recap.2': 'Text sa delí na tokeny a model pracuje s ich číslami.',
      'recap.3': 'Význam slova závisí od kontextu a pozornosť slová prepája.',
      'recap.4': 'Odpoveď vzniká token po tokene, krok za krokom.',
      'recap.5': 'Teplota určuje, koľko model pri výbere riskuje.',
      'recap.6': 'Pravdepodobnosti nie sú dané od začiatku: nastaví ich učenie.',
      'recap.7': 'Znalosti modelu sú uložené v číselných parametroch; vrstvy a šírka určujú jeho veľkosť.',

      'footer.text':
        'Ukážky 01, 05 a 06 počítajú, ako často sa slová vyskytujú v malom vstavanom texte: je to hračkársky model, nie neurónová sieť. Učenie, mapa slov a odhad veľkosti sú samostatné ilustrácie s číslami zvolenými pre názornosť. Všetko beží v prehliadači — po načítaní stránky už server netreba.',
    },

    data: {
      contexts: {
        door: {
          before: 'Vytiahol z vrecka ',
          word: 'kľúč',
          after: ' a odomkol dvere.',
          neighbors: ['zámka', 'dvere', 'kľúčová dierka', 'byt', 'stratiť'],
        },
        music: {
          before: 'Na začiatku notovej osnovy je ',
          word: 'husľový kľúč',
          after: '.',
          neighbors: ['noty', 'husle', 'hudba', 'alt', 'partitúra'],
        },
      },
      embeddingLabels: {
        kot: 'kocúr',
        koshka: 'mačka',
        pes: 'pes',
        sobaka: 'šteňa',
        yabloko: 'jablko',
        grusha: 'hruška',
        apelsin: 'pomaranč',
        banan: 'banán',
      },
      /* Готовые начала фраз и примеры текстов: удобно на телефоне, без клавиатуры. */
      predictStarts: ['dedko', 'babka', 'líška', 'medovníček'],
      generateStarts: ['mačka', 'dedko', 'líška', 'medveď'],
      tokenExamples: [
        { label: 'Veta', text: 'Ahoj, svet! Jazykové modely čítajú text po kúskoch.' },
        { label: 'Interpunkcia', text: 'Počkaj... čo?! Naozaj?!' },
        { label: 'Čísla', text: '27. 11. 2026 o 9:30 som zaplatil 15 eur.' },
        { label: 'Spojovníky', text: 'Česko-slovenský e-mailový open-source projekt.' },
        { label: 'Emoji', text: 'Ľúbim pizzu 🍕 a mačky 🐱!' },
      ],
      attentionWords: ['Kocúr', 'ktorý', 'sedel', 'na', 'parapete', 'zhodil', 'kvet'],
      attentionNames: ['kocúr', 'ktorý', 'sedel', 'na', 'parapete', 'zhodil', 'kvet'],
      attentionCommaAfter: [0, 4],
      learnLabels: {
        paris: 'Paríž',
        london: 'Londýn',
        berlin: 'Berlín',
        madrid: 'Madrid',
        rome: 'Rím',
      },
    },

    corpus: `
Kde bolo, tam bolo, žil raz jeden dedko a jedna babka. Mali malú sliepočku Jarabku.
Sliepočka zniesla vajíčko, a nie obyčajné, ale zlaté.
Dedko do neho bil, bil, ale nerozbil. Babka do neho bila, bila, ale nerozbila.
Bežala okolo myška, mávla chvostíkom, vajíčko spadlo a rozbilo sa. Dedko plače, babka plače.
A sliepočka hovorí: neplač, dedko, neplač, babka. Znesiem vám iné vajíčko,
nie zlaté, ale obyčajné.

Dedko zasadil repku. Repka narástla veľká, preveľká. Dedko ju začal ťahať zo zeme.
Ťahá, ťahá, ale vytiahnuť nemôže. Zavolal babku. Babka sa chytila dedka,
dedko sa chytil repky. Ťahajú, ťahajú, ale vytiahnuť nemôžu. Babka zavolala
vnučku. Vnučka sa chytila babky, babka sa chytila dedka,
dedko sa chytil repky. Ťahajú, ťahajú, ale vytiahnuť nemôžu. Vnučka
zavolala psíka. Psík sa chytil vnučky, vnučka sa chytila babky,
babka sa chytila dedka, dedko sa chytil repky. Ťahajú, ťahajú, ale vytiahnuť nemôžu.
Psík zavolal mačku. Mačka sa chytila psíka, psík sa chytil vnučky,
vnučka sa chytila babky, babka sa chytila dedka, dedko sa chytil repky.
Ťahajú, ťahajú, ale vytiahnuť nemôžu. Mačka zavolala myšku. Myška sa chytila mačky,
mačka sa chytila psíka, psík sa chytil vnučky, vnučka sa chytila babky,
babka sa chytila dedka, dedko sa chytil repky. Ťahajú, ťahajú, a konečne repku vytiahli.

Babka upiekla medovníček. Položila medovníček na parapet, aby vychladol.
Medovníček chvíľu ležal, a potom sa skotúľal preč. Kotúľa sa po ceste,
a stretne ho zajac. Zajac hovorí: medovníček, medovníček, ja ťa zjem.
Medovníček odpovedá: nezjedz ma, zajac, zaspievam ti pesničku.
Ja som medovníček, zo stodoly vymetený, zo sudov vyškrabaný, so smotanou zamiešaný,
v peci upečený, na okne vychladený. Od dedka som ušiel, od babky som ušiel,
aj od teba, zajac, ujdem.
A medovníček sa kotúľal ďalej. Stretne ho vlk. Vlk hovorí: medovníček, medovníček,
ja ťa zjem. Nezjedz ma, vlk, zaspievam ti pesničku. A medovníček sa kotúľal ďalej.
Stretne ho medveď. Medveď hovorí: medovníček, medovníček, ja ťa zjem.
Nezjedz ma, medveď, zaspievam ti pesničku. A medovníček sa kotúľal ďalej.
Stretne ho líška. Líška hovorí: medovníček, medovníček, ja ťa zjem.
Nezjedz ma, líška, zaspievam ti pesničku. Líška hovorí: sadni si mi na nos a zaspievaj ešte raz.
Medovníček si sadol líške na nos, zaspieval pesničku, a líška ham — a zjedla ho.

V poli stojí domček. Beží okolo myška. Uvidí domček a pýta sa:
kto býva v domčeku? Nikto neodpovedá. Myška vojde do domčeka a začne v ňom bývať.
Priskáče žabka a pýta sa: kto býva v domčeku? Ja som myška, a kto si ty?
Ja som žabka. Poď so mnou bývať. Bývajú spolu dve. Pribehne zajačik.
Kto býva v domčeku? Ja som myška, ja som žabka, a kto si ty? Ja som zajačik.
Poď k nám bývať. Bývajú spolu tri. Príde líštička. Bývajú spolu štyri.
Pribehne vĺčik. Bývajú spolu piati. Príde nemotorný medveď.
Medveď vylezie na domček a rozpučí ho.
Varila myšička kašičku v zelenom hrnčeku. Tomu dala, tomu dala, tomu dala, tomu dala, a tomu nedala. Frr, a ulietela!

Slnko jasne svieti. Na ulici prší. Deti sa hrajú na dvore. V lese rastú vysoké stromy.
Vtáky spievajú pesničky. Po oblohe plávajú oblaky. Večer sa ochladí. Mama číta knihu.
Otec opravuje bicykel. Mačka spí na gauči. Pes beží po ceste. V rieke plávajú ryby.
Na jeseň lístie žltne a padá. V zime padá sneh. Na jar sa vracajú vtáky. V lete je veľmi teplo.
Rád čítam knihy. Chodíme do školy. Učiteľka vysvetľuje učivo. Deti pozorne počúvajú.
Na stole stojí šálka čaju. V izbe je teplo a útulne. Za oknom fúka vietor. V noci vidno na oblohe hviezdy.
Mesiac svieti do okna. Ráno pijem čaj. Popoludní sa prechádzame v parku. V obchode je veľa ľudí.
Kúpil som chlieb a mlieko. Babka pečie koláče. Dedko opravuje staré hodiny. Vnúčatá pomáhajú babke.
Rodina sedí pri stole. Všetci pijú čaj s džemom. Mačka sedí pri okne a pozerá na vtáky. Pes stráži dom.
Kravy sa pasú na lúke. Kôň beží po poli. V záhrade rastú jablone.
Na záhone narástli uhorky a paradajky. Na jeseň zbierame úrodu. Vtáky odlietajú na juh.
V zime je v lese ticho. Sneh leží na zemi. Deti sa sánkujú. V lete sa kúpeme v rieke.
Slnko zapadá za les. Prichádza večer. Všetci idú spať. Zajtra bude nový deň.
`,
  };

  global.LLM_LOCALES = global.LLM_LOCALES || {};
  global.LLM_LOCALES[LOCALE.code] = LOCALE;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LOCALE;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
