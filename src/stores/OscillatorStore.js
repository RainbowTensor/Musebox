import { makeObservable, observable, action } from "mobx";
import * as Tone from "tone";

class OscillatorStore {
    adsr = { attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.8 };
    width = 300;
    height = 200;
    padding = 11;
    points = this.createPoints(this.adsr);
    toggleOscillator = false;
    waveForms = ["sine", "sawtooth", "square", "triangle"];
    selectedWave = "sine";
    waveType = "sine1";
    numPartials = 1;
    synths = [];
    distortionAmount = 0;

    constructor() {
        makeObservable(this, {
            adsr: observable,
            points: observable,
            toggleOscillator: observable,
            waveForms: observable,
            selectedWave: observable,
            waveType: observable,
            numPartials: observable,
            synths: observable,
            distortionAmount: observable,
            createPoints: action,
            claculateADSR: action,
            updatePoints: action,
            makeSynths: action,
            setPartials: action,
            setSelectedWave: action,
            setWaveType: action,
            setDistortionAmount: action,
            toggleOscillatorView: action,
        });
    }
    createPoints(adsr) {
        const createObject = (x, y, draggable) => {
            //console.log("xy", x, y);
            return {
                x: x,
                y: y,
                draggable: draggable,
                dragging: false,
                screenX: 0,
                screenY: 0,
            };
        };
        const { attack, decay, sustain, release } = adsr;
        const points = [];
        points.push(createObject(this.padding, this.height, false));
        let x,
            y = this.padding;

        // attack
        x = this.width * attack;
        // y = 0;
        points.push(createObject(x, y, true));

        //decay
        x = this.width * decay + x;
        y = this.height - this.height * sustain;
        points.push(createObject(x, y, true));

        // sustain
        var size = 0.2;
        x = size * this.width + x;
        points.push(createObject(x, y, true));

        // release
        x = this.width;
        y = this.height;
        points.push(createObject(x, y, false));

        return points;
    }
    claculateADSR() {
        const points = this.points;
        const attack = points[1].x / this.width;
        const decay = points[2].x / this.width;
        const sustain = 1 - points[2].y / this.height;
        const release = 1 - points[3].x / this.width;
        this.adsr = {
            attack: attack,
            decay: decay,
            sustain: sustain,
            release: release,
        };
    }
    updatePoints(newValues, idx) {
        const { x, y, draggable, dragging, screenX, screenY } = newValues;
        this.points[idx] = {
            x: x !== null ? x : this.points[idx].x,
            y: y !== null ? y : this.points[idx].y,
            draggable:
                draggable !== null ? draggable : this.points[idx].draggable,
            dragging: dragging !== null ? dragging : this.points[idx].dragging,
            screenX: screenX !== null ? screenX : this.points[idx].screenX,
            screenY: screenY !== null ? screenY : this.points[idx].screenY,
        };
    }
    makeSynths(count) {
        const synths = [];
        const dist = new Tone.Distortion(this.distortionAmount).toDestination();
        const limiter = new Tone.Limiter(-5).toDestination();

        for (let i = 0; i < count; i++) {
            let synth = new Tone.FMSynth({
                oscillator: {
                    type: this.waveType,
                },
                envelope: this.adsr,
                volume: -10,
            }).connect(dist, limiter); //.toDestination();
            synths.push(synth);
        }
        this.synths = synths;
    }
    createLoop(notes) {
        const synths = this.synths;
        //const notes = this.props.barStore.notes;
        let beat = 0;
        Tone.Transport.scheduleRepeat((time) => {
            notes.forEach((row, rowIdx) => {
                const note = row[beat];
                if (note.active) {
                    let synth = synths[rowIdx];
                    //osc.start();
                    synth.triggerAttackRelease(note.note, "8n", time);
                }
            });
            beat = (beat + 1) % 8;
        }, "8n");
    }
    setPartials(num) {
        this.numPartials = num;
        this.setWaveType();
    }
    setSelectedWave(idx) {
        this.selectedWave = this.waveForms[idx];
    }
    setWaveType() {
        this.waveType = `${this.selectedWave}${this.numPartials}`;
    }
    setDistortionAmount(amount) {
        this.distortionAmount = amount;
    }
    toggleOscillatorView() {
        this.toggleOscillator = !this.toggleOscillator;
    }
}

export default OscillatorStore;
