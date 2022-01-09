import React from "react";
import { observer } from "mobx-react";

import "./App.css";
import Sequencer from "./components/Sequencer/Sequencer/Sequencer";
import Oscillator from "./components/Oscillator/Oscillator";
import Table from "./components/Table/Table/Table";
import Bars from "./components/Bars/Bars";

import OscillatorStore from "./stores/OscillatorStore";
import RootStore from "./stores/RootStore";

const oscillatorStore = new OscillatorStore();

const rootStore = new RootStore();
const barStore = rootStore.barStore;
const pieceStore = rootStore.pieceStore;

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <h3 className="title">MuseBox</h3>
                {pieceStore.tableView && (
                    <Table
                        pieceStore={pieceStore}
                        barStore={barStore}
                        oscillatorStore={oscillatorStore}
                    />
                )}
                {oscillatorStore.toggleOscillator && (
                    <Oscillator oscillatorStore={oscillatorStore} />
                )}
                <Sequencer
                    barStore={barStore}
                    pieceStore={pieceStore}
                    oscillatorStore={oscillatorStore}
                />
                <Bars
                    pieceStore={pieceStore}
                    oscillatorStore={oscillatorStore}
                />
            </div>
        );
    }
}

export default observer(App);
