import React from "react";
import { observer } from "mobx-react";
import { Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import Edit from "./pages/Edit";
import List from "./pages/List";
import EditOscillator from "./pages/EditOscillator";

import OscillatorStore from "./stores/OscillatorStore";
import RootStore from "./stores/RootStore";

const oscillatorStore = new OscillatorStore();

const rootStore = new RootStore();
const barStore = rootStore.barStore;
const pieceStore = rootStore.pieceStore;

const stores = {
    oscillatorStore: oscillatorStore,
    barStore: barStore,
    pieceStore: pieceStore,
};

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <h3 className="title">MuseBox</h3>
                <Routes>
                    <Route path="/edit" element={<Edit stores={stores} />}>
                        <Route
                            path=":pieceId"
                            element={<Edit stores={stores} />}
                        />
                    </Route>
                    <Route path="/list" element={<List stores={stores} />}>
                        <Route
                            path=":type"
                            element={<List stores={stores} />}
                        />
                    </Route>
                    <Route
                        path="/oscillator"
                        element={<EditOscillator stores={stores} />}
                    />
                    <Route path="*" element={<Navigate to="/list/piece" />} />
                </Routes>
            </div>
        );
    }
}

export default observer(App);
