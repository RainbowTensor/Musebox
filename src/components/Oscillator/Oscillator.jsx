import React from "react";
import * as Tone from "tone";
import { observer } from "mobx-react";

import Graph from "../Graph/Graph";
import "./Oscillator.css";

class Oscillator extends React.Component {
    constructor(props) {
        super(props);

        this.dist = new Tone.Distortion(
            this.props.oscillatorStore.distortionAmount
        ).toDestination();
        this.synth = new Tone.FMSynth({
            oscillator: {
                type: this.props.oscillatorStore.waveType,
            },
            envelope: this.props.oscillatorStore.adsr,
            volume: 0,
        }).connect(this.dist);
    }
    onMouseDownEventHandler = (e) => {
        this.synth.set({ envelope: this.props.oscillatorStore.adsr });
        this.synth.triggerAttack("C4");
    };
    onMouseUpEventHandler = (e) => {
        this.synth.triggerRelease();
    };
    setButtonEventHandler = (e) => {
        this.props.oscillatorStore.claculateADSR();
        this.props.oscillatorStore.toggleOscillatorView();
        this.props.oscillatorStore.makeSynths(6);
    };
    partialsSliderEventHandler = (e) => {
        this.props.oscillatorStore.setPartials(e.target.value);
        this.synth.set({
            oscillator: {
                type: this.props.oscillatorStore.waveType,
            },
        });
    };
    waveSelectEventHandler = (e, waveIdx) => {
        this.props.oscillatorStore.setSelectedWave(waveIdx);
        this.synth.set({
            oscillator: {
                type: this.props.oscillatorStore.selectedWave,
            },
        });
    };
    distortionSliderEventHandler = (e) => {
        this.props.oscillatorStore.setDistortionAmount(e.target.value);
        this.dist.set({ distortion: e.target.value });
    };
    render() {
        const store = this.props.oscillatorStore;
        const numPartials = store.numPartials;
        const waveForms = store.waveForms;
        const selectedWave = store.selectedWave;
        const distortionAmount = store.distortionAmount;
        return (
            <div className="oscillatorWrapper">
                <div className="Oscillator">
                    <h4 className="text">Set ADSR Envelope:</h4>
                    <Graph store={this.props.oscillatorStore} />
                    <div className="waveMenu">
                        <h4>Select wave form:</h4>
                        {waveForms.map((waveForm, waveIdx) => {
                            let id = "";
                            if (waveForm === selectedWave) {
                                id = "active";
                            }
                            return (
                                <h4
                                    className="waveItem"
                                    id={id}
                                    key={waveIdx}
                                    onClick={(e) => {
                                        this.waveSelectEventHandler(e, waveIdx);
                                    }}
                                >
                                    {waveForm}
                                </h4>
                            );
                        })}
                    </div>
                    <div className="rangeWrapper">
                        <h4>Set number of partials:</h4>
                        <input
                            className="inputRange"
                            type="range"
                            min={1}
                            max={32}
                            value={numPartials}
                            onChange={this.partialsSliderEventHandler}
                        ></input>
                        <h4>{numPartials}</h4>
                    </div>
                    <div className="rangeWrapper">
                        <h4>Set distortion amount:</h4>
                        <input
                            className="inputRange"
                            type="range"
                            min={0}
                            max={1}
                            step={0.1}
                            value={distortionAmount}
                            onChange={this.distortionSliderEventHandler}
                        ></input>
                        <h4>{distortionAmount}</h4>
                    </div>
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
