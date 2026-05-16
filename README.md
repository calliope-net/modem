
> Diese Seite bei [https://calliope-net.github.io/modem/](https://calliope-net.github.io/modem/) öffnen

# Modem - Datenübertragung mit Licht
### asynchrone serielle Datenübertragung nach [RS-232](https://de.wikipedia.org/wiki/RS-232)

Die 60 Jahre alte Methode, Nullen und Einsen zwischen zwei Computern zu übertragen, funktioniert auch mit Licht. 
Wie bei einer Lichtschranke wird jedes Bit als `Licht an` oder `Licht aus` übertragen. 

LED als Sender und Fototransistor als Empfänger sind aber an verschiedene Computer angeschlossen.
Geeignet sind alle Controller, die LED und Fototransistor ansteuern können. Dazu gehören Calliope und sämtliche fischertechnik Controller.
Damit können Bytes zwischen verschiedenen Systemen übertragen werden, die sonst nicht kompatibel sind.

Die hier beschriebenen Programme übertragen 7-Bit ASCII Zeichen. Für die Eingabe von Text beim Sender und die Ausgabe / Anzeige beim Empfänger haben die Controller unterschiedliche Möglichkeiten. 
Für die Ansteuerung von Tastaturen und Displays sind für alle Controller (I²C)-Erweiterungen verfügbar.
Die Erweiterung Modem kümmert sich nur um die Übertragung von Text-Zeichen, nicht um die Ein- und Ausgabe.

Die ASCII Codierung der Buchstaben, Ziffern und sonstigen Zeichen steht in der [Codetabelle](png/ascii-0-127.pdf).
Die 128 Zeichen mit dem Code 0 bis 127 werden in 7 Bit = 7 Nullen oder Einsen codiert. Das achte Bit ist beim ASCII Code immer 0.

Zum Beispiel wird der Buchstabe `K` codiert in `01001011`.



![](png/rs232.png)


## Als Erweiterung verwenden

Dieses Repository kann als **Erweiterung** in MakeCode hinzugefügt werden.

* öffne [https://makecode.calliope.cc/](https://makecode.calliope.cc/)
* klicke auf **Neues Projekt**
* klicke auf **Erweiterungen** unter dem Zahnrad-Menü
* nach **https://github.com/calliope-net/modem** suchen und importieren

## Dieses Projekt bearbeiten ![Build status badge](https://github.com/calliope-net/modem/workflows/MakeCode/badge.svg)

Um dieses Repository in MakeCode zu bearbeiten.

* öffne [https://makecode.calliope.cc/](https://makecode.calliope.cc/)
* klicke auf **Importieren** und dann auf **Importiere URL**
* füge **https://github.com/calliope-net/modem** ein und klicke auf Importieren

## Blocks preview

This image shows the blocks code from the last commit in master.
This image may take a few minutes to refresh.

![A rendered view of the blocks](https://github.com/calliope-net/modem/raw/master/.github/makecode/blocks.png)

#### Metadaten (verwendet für Suche, Rendering)

* for PXT/calliopemini
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
