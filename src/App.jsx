import React from "react";
import { observer } from "mobx-react";
import { Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import Header from "./components/Header/Header";
import Edit from "./pages/Edit";
import PieceList from "./pages/PieceList";
import BarList from "./pages/BarList";
import EditOscillator from "./pages/EditOscillator";

import RootStore from "./stores/RootStore";

const rootStore = new RootStore();
const barStore = rootStore.barStore;
const pieceStore = rootStore.pieceStore;
const oscillatorStore = rootStore.oscillatorStore;
const tableStore = rootStore.oscillatorStore;

const stores = {
    oscillatorStore: oscillatorStore,
    barStore: barStore,
    pieceStore: pieceStore,
    tableStore: tableStore,
};

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <h3 className="title">MuseBox</h3>
                <Header pieceStore={pieceStore} />
                <Routes>
                    <Route
                        path="/edit/:pieceId"
                        element={<Edit stores={stores} />}
                    >
                        {/*<Route
                            path=":pieceId"
                            element={<Edit stores={stores} />}
                        />*/}
                    </Route>
                    <Route path="/create" element={<Edit stores={stores} />} />
                    <Route
                        path="/list/piece"
                        element={<PieceList stores={stores} />}
                    />
                    <Route
                        path="/list/bar"
                        element={<BarList stores={stores} />}
                    />
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
