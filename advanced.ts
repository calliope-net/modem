
namespace modem // advanced.ts
/*

*/ {

    // ========== group="Senden (ASCII Code 32..127)" advanced=true

    //% group="Senden (ASCII Code 32..127)" advanced=true blockGap=8
    //% block="ASCII Code aus Text %text || Index %index" weight=8
    //% index.min=0 index.max=9 index.defl=0
    export function charCodeAt(text: string, index = 0) {
        return text.charCodeAt(index)
    }

    // blockId=rs_232_ascii_to_array10
    //% group="Senden (ASCII Code 32..127)" advanced=true blockGap=8
    //% block="10 Bit Array aus ASCII Code %ascii_code" weight=3
    //% ascii_code.min=32 ascii_code.max=127 ascii_code.defl=13
    export function ascii_to_array10(ascii_code: number): boolean[] {
        /*
        Parameter byte: 7 Bit ASCII Code 0..127
        Return Array: 10 boolean Elemente (wahr/falsch)
        1 Start, 7 Daten 2^0..2^6, 1 Parität, 1 Stop-Bit
        negative Logik: 0=wahr und 1=falsch
        */
        let parity = 0, bBit: boolean
        let array_10bit: boolean[] = [true, true, true, true, true, true, true, true, true, true]
        // [0] 1 START Bit = wahr (Licht an) [1]..[7] 7 Daten Bit 2 ^ 0..2 ^ 6
        for (let i = 1; i <= 7; i++) {
            if ((ascii_code & 0x01) == 1) { // Bit 2^0 ist 1
                array_10bit[i] = false
                parity++
            }
            //alle 8 Bit nach rechts schieben  2 ^ 1 wird 2 ^ 0 >> 2 ^ 0 fällt raus
            ascii_code = ascii_code >> 1
        }
        if ((parity & 0x01) == 1) { // Parity ist ungerade
            // [8] 1 PARTIY Bit:  wenn Anzahl der Einsen ungerade ist, das letzte Bit auf 1 (falsch) setzen, damit eine gerade Anzahl entsteht
            array_10bit[8] = false
        }
        // [9] 1 STOP Bit = falsch (Licht aus)
        array_10bit[9] = false

        // array_10bit.push(parity % 2 != 0) // [7] das 8. Bit Parity 
        return array_10bit
    }

    //% group="Senden (ASCII Code 32..127)" advanced=true blockGap=8
    //% block="sende %array_10bit" weight=1
    // array_10bit.shadow=rs_232_ascii_to_array10
    export function rs232_sende10bit(array_10bit: boolean[]) {
        /*
        1 Zeichen senden mit Licht
        Parameter Array: 10 boolean Elemente (wahr/falsch)
        1 Startbit, 7 Datenbit, 1 Paritätsbit, 1 Stopbit
        negative Logik: 0=wahr=Licht an und 1=falsch=aus
        */
        let send_pause_ms = input.runningTime() + q_takt_ms

        // 10 Bit aus Array senden: 1 Start, 7 Daten 2 ^ 0..2 ^ 6, 1 Parität, 1 Stop - Bit
        for (let i = 0; i < array_10bit.length; i++) {
            sende_1bit(array_10bit[i]) // 7 Datenbits + 1 Paritätsbit

            basic.pause(send_pause_ms - input.runningTime())
            send_pause_ms += q_takt_ms
        }

        // STOP Bit verlängern als Pause (Licht aus)
        //basic.pause(send_pause_ms - input.runningTime())
        basic.pause(q_takt_ms * q_stop_bits)
    }






    // ========== group="Empfangen (1 Start, 7 Daten 2^0..2^6, 1 Parität, 1 Stop-Bit)" advanced=true


    //% group="Empfangen (1 Start, 7 Daten 2^0..2^6, 1 Parität, 1 Stop-Bit)" advanced=true blockGap=8
    //% block="Text-Zeichen aus ASCII Code %ascii_code" weight=8
    //% ascii_code.min=32 ascii_code.max=127 ascii_code.defl=32
    export function fromCharCode(ascii_code: number) {
        return String.fromCharCode(ascii_code)
    }

    //% group="Empfangen (1 Start, 7 Daten 2^0..2^6, 1 Parität, 1 Stop-Bit)" advanced=true blockGap=8
    //% block="ASCII Code aus %array_10bit" weight=3
    export function ascii_from_array10(array_10bit: boolean[]): number {
        /*
        Parameter Array: 10 boolean Elemente (wahr/falsch)
        1 Start, 7 Daten 2^0..2^6, 1 Parität, 1 Stop-Bit
        negative Logik: 0=wahr und 1=falsch
        Return byte: 7 Bit ASCII Code 0..127
        Return bei Fehler -1 .. -4
        */
        let ascii_code = 0
        let parity = 0
        if (array_10bit.length < 10) { // 10 Bit im Array boolean[]
            // Array Länge muss >=10 sein; bei Fehler: Return - 1
            ascii_code = -1
        } else if (!array_10bit[0]) {
            // [0] Start Bit muss true sein; bei Fehler: Return - 2
            ascii_code = -2
        } else if (array_10bit[9]) {
            // [9] Stop Bit muss false sein; bei Fehler: Return - 4
            ascii_code = -2
        } else {
            for (let i = 1; i <= 7; i++) {
                // index [1]..[7]; 7 Daten-Bits (negative Logik)
                if (!array_10bit[i]) {
                    parity++
                    // 2^(1-1) = 2^0 = 1 bis 2^6 = 64; addiert 1, 2, 4, 8, 16, 32, 64 bei false
                    ascii_code += 2 ** (i - 1)
                }
            }
            if (!array_10bit[8]) {
                // [8] Parity Bit auswerten (negative Logik)
                parity++
            }
            if ((parity & 0x01) == 1) {
                // Parity muss gerade sein; bei Fehler: Return - 3
                ascii_code = -3
            }
        }
        return ascii_code
    }

    //% group="Empfangen (1 Start, 7 Daten 2^0..2^6, 1 Parität, 1 Stop-Bit)" advanced=true blockGap=8
    //% block="empfange 10 Bit Array" weight=1
    export function rs232_empfange10bit(): boolean[] {
        let empf_pause_ms: number
        let array_10bit: boolean[] = []

        // warten auf START Bit (Fototransistor hell)
        while (!empfange1bit()) {
            //empf_pause_ms = input.runningTime() + n_takt_ms * n_startBitTime // 0.5 oder 0.45 zwischen Beginn Startbit und einlesen
            if (n_empf_abbrechen)
                break // kann vom Bedienfeld abgebrochen werden
            /* if (q_takt_ms >= 50)
                basic.pause(10) // ohne Pause funktioniert das Abbruch Ereignis nicht (z.B. Knopf A halten)
            else
                basic.pause(q_takt_ms * 0.1) */
        }
        if (!n_empf_abbrechen) {
            // Daten empfangen
            // Startbit nach einer halben Taktzeit einlesen
            empf_pause_ms = input.runningTime() + q_takt_ms * q_start_bit_time // 0.5 oder 0.45 zwischen Beginn Startbit und einlesen

            for (let i = 0; i < 10; i++) {
                basic.pause(empf_pause_ms - input.runningTime())
                array_10bit.push(empfange1bit()) // Lichtschranke abfragen
                // einen Takt warten, trifft das nächste Bit in der Mitte
                empf_pause_ms += q_takt_ms
                if (n_empf_abbrechen)
                    break // kann vom Bedienfeld abgebrochen werden
            }
        }
        return array_10bit
    }



    // ========== group="Funktionen" advanced=true blockGap=8

    //% group="Funktionen" advanced=true
    //% block="%array_10bit to Bin-String" weight=5
    export function array_tostring(array_10bit: boolean[]): string {
        let bin_string = ""
        if (array_10bit && array_10bit.length > 0) {
            for (let i = 0; i < array_10bit.length; i++) {
                bin_string += array_10bit[i] ? "0" : "1"
                if (i == 0 || i == 7)
                    bin_string += "^"
            }
        }
        return bin_string
    }



    //% group="Funktionen" advanced=true
    //% block="%i0 zwischen %i1 und %i2" weight=4
    export function between(i0: number, i1: number, i2: number): boolean {
        return (i0 >= i1 && i0 <= i2)
    }



    // ========== group="ASCII" advanced=true

    //% group="Kommentar" advanced=true blockGap=8
    //% block="// %text" weight=6
    export function comment(text: string): void { }


} // advanced.ts
