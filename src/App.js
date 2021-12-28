import React from "react";
import { observer } from "mobx-react";

import "./App.css";
import Sequencer from "./components/Sequencer/Sequencer/Sequencer";
import Oscillator from "./components/Oscillator/Oscillator";
import Table from "./components/Table/Table";

import StateManager from "./StateManager";

const stateManager = new StateManager();

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <h3>start</h3>
                {stateManager.toggleTable && (
                    <Table stateManager={stateManager} />
                )}
                {stateManager.toggleOscillator && (
                    <Oscillator stateManager={stateManager} />
                )}
                <Sequencer stateManager={stateManager} />
            </div>
        );
    }
}

export default observer(App);
