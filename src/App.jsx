import React from "react";
import { observer } from "mobx-react";
import { Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import Header from "./components/Header/Header";
import Edit from "./pages/Edit";
import List from "./pages/List";
import EditOscillator from "./pages/EditOscillator";

import RootStore from "./stores/RootStore";

const rootStore = new RootStore();
const barStore = rootStore.barStore;
const pieceStore = rootStore.pieceStore;
const oscillatorStore = rootStore.oscillatorStore;

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
                <Header pieceStore={pieceStore} />
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
