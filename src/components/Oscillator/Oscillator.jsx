import React from "react";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react";

import Graph from "../Graph/Graph";
import "./Oscillator.css";

function Oscillator({ oscillatorStore, pieceStore }) {
    const navigate = useNavigate();

    const onMouseDownEventHandler = (e) => {
        oscillatorStore.setSythParams({
            envelope: oscillatorStore.adsr,
            oscillator: {
                type: oscillatorStore.waveType,
            },
        });
        oscillatorStore.triggerAttack("C4");
    };
    const onMouseUpEventHandler = (e) => {
        oscillatorStore.triggerRelease();
    };
    const setButtonEventHandler = (e) => {
        oscillatorStore.calculateADSR();
        oscillatorStore.makeSynths(6);
        navigate(`/edit/${pieceStore.id}`);
    };
    const partialsSliderEventHandler = (e) => {
        oscillatorStore.setPartials(e.target.value);
    };
    const waveSelectEventHandler = (e, waveIdx) => {
        oscillatorStore.setSelectedWave(waveIdx);
    };
    const distortionSliderEventHandler = (e) => {
        oscillatorStore.setDistortionAmount(e.target.value);
    };
    const numPartials = oscillatorStore.numPartials;
    const waveForms = oscillatorStore.waveForms;
    const selectedWave = oscillatorStore.selectedWave;
    const distortionAmount = oscillatorStore.distortionAmount;
    return (
        <div className="oscillatorWrapper">
            <div className="Oscillator">
                <h4 className="text">Set ADSR Envelope:</h4>
                <Graph store={oscillatorStore} />
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
                                    waveSelectEventHandler(e, waveIdx);
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
                        onChange={partialsSliderEventHandler}
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
                        onChange={distortionSliderEventHandler}
                    ></input>
                    <h4>{distortionAmount}</h4>
                </div>
                <button
                    className="buttonTry"
                    onMouseDown={onMouseDownEventHandler}
                    onMouseUp={onMouseUpEventHandler}
                >
                    Try
                </button>
                <button className="buttonSet" onClick={setButtonEventHandler}>
                    Set
                </button>
            </div>
        </div>
    );
}

export default observer(Oscillator);
