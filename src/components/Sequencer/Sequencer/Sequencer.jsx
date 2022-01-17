import React from "react";
import { useNavigate } from "react-router-dom";
import * as Tone from "tone";
import { observer } from "mobx-react";

import SequencerGrid from "../SequencerGrid/SequencerGrid";
import "./Sequencer.css";

function Sequencer({ barStore, pieceStore, oscillatorStore }) {
    const navigate = useNavigate();

    const playEventHandler = (e) => {
        const started = barStore.sequencerStarted;
        const playing = barStore.sequencerPlaying;

        if (!started) {
            pieceStore.toneStart();
            oscillatorStore.createLoop(barStore.notes);
            barStore.toggleSequencerStarted();
        }
        if (!playing) {
            pieceStore.transportStart();
            barStore.toggleSequencerPlaying();
        } else {
            pieceStore.transportStop();
            barStore.toggleSequencerPlaying();
            barStore.toggleSequencerStarted();
        }
    };

    let name;
    const onChangeEventHandler = (e) => {
        name = e.target.value;
    };
    const setNameEventHandler = (e) => {
        pieceStore.setPieceName(name);
    };
    const viewOscEventHandler = (e) => {
        navigate("/oscillator");
    };
    const viewListEventHandler = (e) => {
        if (!pieceStore.pieceTab) {
            pieceStore.toggleTabs();
        }
        navigate("/list/piece");
    };

    return (
        <div className="Sequencer">
            <div className="inputWrapper">
                <label>Name your Piece: </label>
                <input
                    className="textInput"
                    type="text"
                    placeholder={pieceStore.name}
                    onChange={onChangeEventHandler}
                ></input>
                <input
                    className="submit"
                    type="submit"
                    value="set"
                    onClick={setNameEventHandler}
                ></input>
            </div>
            <SequencerGrid store={barStore} />
            <button className="playButton" onClick={playEventHandler}>
                {!barStore.sequencerPlaying ? "Play" : "Stop"}
            </button>
            <button className="viewButton" onClick={viewOscEventHandler}>
                View Oscillator
            </button>
            <button className="viewButton" onClick={viewListEventHandler}>
                View List
            </button>
        </div>
    );
}

export default observer(Sequencer);
