import React from "react";
import * as Tone from "tone";
import { observer } from "mobx-react";

import Graph from "../Graph/Graph";
import "./Oscillator.css";

class Oscillator extends React.Component {
    constructor(props) {
        super(props);

        this.synth = new Tone.Synth({
            oscillator: {
                type: "sine",
            },
            envelope: this.props.stateManager.adsr,
            volume: -10,
        }).toDestination();
    }
    onMouseDownEventHandler = (e) => {
        this.synth.set({ envelope: this.props.stateManager.adsr });
        this.synth.triggerAttack("C4");
    };
    onMouseUpEventHandler = (e) => {
        this.synth.triggerRelease();
    };
    setButtonEventHandler = (e) => {
        this.props.stateManager.claculateADSR();
        this.props.stateManager.toggleOscillatorView();
    };
    render() {
        return (
            <div className="oscillatorWrapper">
                <div className="Oscillator">
                    <Graph stateManager={this.props.stateManager} />
                    <button
                        className="buttonTry"
                        onMouseDown={this.onMouseDownEventHandler}
                        onMouseUp={this.onMouseUpEventHandler}
                    >
                        Try
                    </button>
                    <button
                        className="buttonSet"
                        onClick={this.setButtonEventHandler}
                    >
                        Set
                    </button>
                </div>
            </div>
        );
    }
}

export default observer(Oscillator);
