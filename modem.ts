
//% color=#002050 icon="\uf093" block="RS-232 Modem" weight=15
namespace modem // modem.ts
/* 
    C16: fischertechnik Fototransistor 36134 mit Pull-Up Widerstand 100 k / Calliope v2
    C17: fischertechnik Lichtschranken-LED 9V 0.01A 162135
    oder
    P2: Fototransistor ohne Pull-Up Widerstand
    P1: Lichtschranken-LED
    Takt zwischen 2 Calliope: 50ms / zum BT Smart Controller: 400ms
    https://de.wikipedia.org/wiki/RS-232
    https://calliope-net.github.io/rs232-e41/
    https://calliope-net.github.io/rs232-e41/rs232.png

    Lutz Elßner März 2026
*/ {
    let q_pin_led: DigitalPin = DigitalPin.P1
    let q_pin_fototransistor: AnalogPin = AnalogPin.P2 // dunkel~860 / hell~20 / Calliope v2
    let q_helligkeit: number = 150
    export let q_takt_ms: number = 400 // Takt zwischen 2 Calliope: 20ms / zum BT Smart Controller: 400ms
    export let q_start_bit_time: number = 0.5 // 0.5 oder 0.45 zwischen Beginn Startbit und einlesen
    export let q_stop_bits: number = 1
    export let n_empf_abbrechen: boolean = false // warten auf Startbit beim Empfang abbrechen



    // ========== group="asynchrone serielle Datenübertragung mit Licht"

    //% group="asynchrone serielle Datenübertragung mit Licht"
    //% block="Pins: LED %pin_led Fototransistor %pin_fototransistor || Helligkeit < %helligkeit" weight=5
    //% pin_led.defl=DigitalPin.P1 pin_fototransistor.defl=AnalogPin.P2 helligkeit.defl=150
    export function set_pins(pin_led: DigitalPin, pin_fototransistor: AnalogPin, helligkeit = 150) {
        q_pin_led = pin_led
        q_pin_fototransistor = pin_fototransistor
        q_helligkeit = helligkeit
    }

    //% group="asynchrone serielle Datenübertragung mit Licht"
    //% block="Takt: %takt_ms ms || Startbit * %start_bit_time Stopbits * %stop_bits" weight=4
    //% takt_ms.min=20 takt_ms.max=1000 takt_ms.defl=400
    //% start_bit_time.defl=0.5
    //% stop_bits.min=1 stop_bits.max=6 stop_bits.defl=1
    export function set_takt(takt_ms: number, start_bit_time = 0.5, stop_bits = 1) {
        q_takt_ms = takt_ms
        q_start_bit_time = start_bit_time
        q_stop_bits = stop_bits
    }



    // ========== group="Senden (LED)"


    //% group="Senden (LED)"
    //% block="sende 1 Zeichen ASCII Code %ascii_code" weight=6
    //% ascii_code.min=32 ascii_code.max=127 ascii_code.defl=13
    export function sende_code(ascii_code: number) {
        rs232_sende10bit(ascii_to_array10(ascii_code))
    }

    //% group="Senden (LED)"
    //% block="sende Text Zeile %text mit ↵ ENTER" weight=4
    export function sende_text_mit13(text: string) {
        /*
        Parameter text: string; mit_log: boolean
        sendet jedes Zeichen aus text + chr(13)
        ASCII 13: ENTER / CR 'Carriage Return'
        Parameter mit_log = True:
        protokolliert jedes Zeichen in Konsole
        */
        for (let i = 0; i < text.length; i++) {
            sende_code(text.charCodeAt(i))
        }
        sende_code(13)
    }

    export function sende_1bit(bit: boolean) {
        if (bit)
            pins.digitalWritePin(q_pin_led, 1)
        else
            pins.digitalWritePin(q_pin_led, 0)
    }



    // ========== group="Empfangen (Fototransistor)"

    //% group="Empfangen (Fototransistor)"
    //% block="empfange 1 Zeichen ASCII Code (oder Fehlercode)" weight=6
    export function empfange_1zeichen() {
        n_empf_abbrechen = false
        return ascii_from_array10(rs232_empfange10bit()) // ASCII-Code oder Fehler-Code -1 -2 -3 -4
    }

    //% group="Empfangen (Fototransistor)"
    //% block="empfange Text Zeile bis ↵ ENTER" weight=4
    export function empfange_text_bis13() {
        /*
        wartet auf (Licht) Zeichen
        hängt jedes empfangene Zeichen an text an
        endet erst nach Code 13 / CR / Zeilenende
        kein Abbruch bei Fehler, Fehlercode im Text
        Parameter mit_log = True:
        protokolliert jedes Zeichen in Konsole
        */
        n_empf_abbrechen = false
        let empf_text = ""
        while (!n_empf_abbrechen) {
            // 1 Zeichen empfangen (10 Licht-Zeichen)
            let array_10bit = rs232_empfange10bit()
            let ascii_code = ascii_from_array10(array_10bit)

            if (ascii_code == 13) {
                // beendet die Empfangs-Schleife; 13 / CR / Zeilenende
                break
            }
            if (between(ascii_code, 32, 127))
                empf_text += String.fromCharCode(ascii_code)
            else
                empf_text += "|" + ascii_code + "|"
        }
        return empf_text
    }

    //% group="Empfangen (Fototransistor)"
    //% block="empfange 1 Bit (warten auf Startbit)" weight=3
    export function empfange1bit(): boolean {
        // hell ist true, analoger Wert < 150
        return pins.analogReadPin(q_pin_fototransistor) < q_helligkeit
    }

    //% group="Empfangen (Fototransistor)"
    //% block="Empfangen abbrechen || %abbrechen" weight=2
    //% abbrechen.shadow=toggleYesNo abbrechen.defl=1
    export function empfang_abbrechen(abbrechen = true) {
        n_empf_abbrechen = abbrechen
    }


} // modem.ts
