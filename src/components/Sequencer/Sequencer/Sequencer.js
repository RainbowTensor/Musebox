import React from "react";
import * as Tone from "tone";
import { observer } from "mobx-react";

import SequencerGrid from "../SequencerGrid/SequencerGrid";

const makeSynths = (count, adsr) => {
    const synths = [];

    for (let i = 0; i < count; i++) {
        let synth = new Tone.Synth({
            oscillator: {
                type: "sine",
            },
            envelope: adsr,
            volume: -10,
        }).toDestination();
        synths.push(synth);
    }
    return synths;
};

class Sequencer extends React.Component {
    constructor(props) {
        super(props);
        this.synths = makeSynths(6, this.props.stateManager.adsr);
    }
    createLoop = () => {
        const notes = this.props.stateManager.notes;
        let beat = 0;
        Tone.Transport.scheduleRepeat((time) => {
            notes.forEach((row, rowIdx) => {
                const note = row[beat];
                if (note.active) {
                    let synth = this.synths[rowIdx];
                    //osc.start();
                    synth.triggerAttackRelease(note.note, "8n", time);
                }
            });
            beat = (beat + 1) % 8;
        }, "8n");
    };
    playEventHandler = (e) => {
        const stateManager = this.props.stateManager;
        const started = stateManager.sequencerStarted;
        const playing = stateManager.sequencerPlaying;

        if (!started) {
            Tone.start();
            this.createLoop();
            stateManager.toggleSequencerStarted();
        }
        if (!playing) {
            Tone.Transport.start();
            stateManager.toggleSequencerPlaying();
        } else {
            Tone.Transport.stop();
            stateManager.toggleSequencerPlaying();
        }
    };
    saveEventHandler = (e) => {
        this.props.stateManager.postPieceAsync();
    };
    render() {
        const stateManager = this.props.stateManager;

        return (
            <div className="Sequencer">
                <SequencerGrid stateManager={stateManager} />
                <button onClick={this.playEventHandler}>
                    {!stateManager.sequencerPlaying ? "play" : "stop"}
                </button>
                <button onClick={this.saveEventHandler}>save</button>
            </div>
        );
    }
}

export default observer(Sequencer);
