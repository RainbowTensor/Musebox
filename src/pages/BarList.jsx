import React from "react";
import { useParams } from "react-router-dom";
import Table from "../components/Table/Table/Table";

function BarList({ stores }) {
    const { oscillatorStore, barStore, pieceStore, tableStore } = stores;
    return (
        <Table
            pieceStore={pieceStore}
            barStore={barStore}
            oscillatorStore={oscillatorStore}
            tableStore={tableStore}
            type="bar"
        />
    );
}

export default BarList;
