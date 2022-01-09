import React from "react";
import * as Tone from "tone";
import { observer } from "mobx-react";

import SequencerGrid from "../SequencerGrid/SequencerGrid";
import "./Sequencer.css";

class Sequencer extends React.Component {
    playEventHandler = (e) => {
        const barStore = this.props.barStore;
        const started = barStore.sequencerStarted;
        const playing = barStore.sequencerPlaying;

        if (!started) {
            Tone.start();
            this.props.oscillatorStore.createLoop(this.props.barStore.notes);
            barStore.toggleSequencerStarted();
        }
        if (!playing) {
            Tone.Transport.start();
            barStore.toggleSequencerPlaying();
        } else {
            Tone.Transport.stop();
            Tone.Transport.cancel();
            barStore.toggleSequencerPlaying();
            barStore.toggleSequencerStarted();
        }
    };
    onChangeEventHandler = (e) => {
        // console.log(e);
        this.name = e.target.value;
    };
    setNameEventHandler = (e) => {
        // console.log(this.name);
        this.props.pieceStore.setPieceName(this.name);
        console.log("name", this.props.pieceStore.name);
    };
    viewOscEventHandler = (e) => {
        this.props.oscillatorStore.toggleOscillatorView();
    };
    render() {
        const barStore = this.props.barStore;

        return (
            <div className="Sequencer">
                <div className="inputWrapper">
                    <label>Name your Piece: </label>
                    <input
                        className="textInput"
                        type="text"
                        placeholder="splendid-spleen"
                        onChange={this.onChangeEventHandler}
                    ></input>
                    <input
                        className="submit"
                        type="submit"
                        value="set"
                        onClick={this.setNameEventHandler}
                    ></input>
                </div>
                <SequencerGrid store={barStore} />
                <button className="playButton" onClick={this.playEventHandler}>
                    {!barStore.sequencerPlaying ? "Play" : "Stop"}
                </button>
                <button
                    className="viewOscButton"
                    onClick={this.viewOscEventHandler}
                >
                    View Oscillator
                </button>
            </div>
        );
    }
}

export default observer(Sequencer);
