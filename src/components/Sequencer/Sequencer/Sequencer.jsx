import React from "react";
import { observer } from "mobx-react";

import SequencerGrid from "../SequencerGrid/SequencerGrid";
import "./Sequencer.css";

function Sequencer({ barStore, pieceStore, oscillatorStore }) {
    const playEventHandler = (e) => {
        barStore.togglePlay();
    };

    const onChangeEventHandler = (e) => {
        let name = e.target.value;
        pieceStore.setPieceName(name);
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
            </div>
            <SequencerGrid store={barStore} />
            <div className="sequencerButtonsWrappers">
                <button className="playButton" onClick={playEventHandler}>
                    {!barStore.sequencerPlaying ? "Play" : "Stop"}
                </button>
            </div>
        </div>
    );
}

export default observer(Sequencer);
