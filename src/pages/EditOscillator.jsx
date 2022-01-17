import React from "react";
import Oscillator from "../components/Oscillator/Oscillator";

function EditOscillator({ stores }) {
    const { oscillatorStore, barStore, pieceStore } = stores;
    return (
        <Oscillator oscillatorStore={oscillatorStore} pieceStore={pieceStore} />
    );
}

export default EditOscillator;
