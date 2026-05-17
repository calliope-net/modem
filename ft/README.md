
> Diese Seite bei [https://calliope-net.github.io/modem/ft/](https://calliope-net.github.io/modem/ft/) öffnen

# Modem - Datenübertragung mit Licht

## Blöcke für fischertechnik ROBO Pro Coding

#### Quellcodedatei: ascii.py

### Senden (LED)

Block **ascii_sende_code** (ascii_code, mit_log)
* Sendet 1 Zeichen (Code)
* *ascii_code*: 32..127 oder 13 für ENTER
* *mit_log* = true: protokolliert das Zeichen in Konsole

Block **ascii_sende_text_mit13** (text, mit_log)
* Sendet alle Zeichen aus *text* und hängt ENTER (13) an.
* *mit_log* = true: protokolliert jedes Zeichen in Konsole



### Empfangen (Fototransistor)

Block **ascii_empfange_code** : number
* Wartet auf Start-Bit und gibt nach Empfang den ASCII-Code (0..127) zurück.
* Zeigt Fehlercode in der Konsole oder auf dem TXT40 Display an.

Fehlercode|Fehler
---|---
-1|weniger als 10 Bit empfangen
-2|Start-Bit Fehler
-3|Parity-Bit Fehler
-4|Stop-Bit Fehler

Block **ascii_empfange_text_bis13** (mit_log) : string
* *mit_log* = true: protokolliert jedes Zeichen in Konsole
* Wartet auf Start-Bit und empfängt alle Zeichen bis ENTER (13).
* Gibt dann den Text (ohne ENTER) zurück.
* Gültige ASCII-Codes 32..127 werden in das Zeichen umgewandelt.
* Ungültige und Fehler-Codes werden in den Text als \|-1\| oder \|27\| eingefügt.

> Die zwei Funktionen **empfange** blockieren das Programm. Es reagiert nicht mehr, bis der Fototransistor ein Start-Bit (Licht an) empfangen hat.
> Mit der folgenden Funktion kann in einer eigenen Schleife erkannt werden, ob der Fototransistor hell ist, also der Empfang beginnt.


