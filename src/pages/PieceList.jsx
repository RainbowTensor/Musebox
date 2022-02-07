import React from "react";
import { useParams } from "react-router-dom";
import Table from "../components/Table/Table/Table";

function PieceList({ stores }) {
    const { oscillatorStore, barStore, pieceStore, tableStore } = stores;
    return (
        <Table
            pieceStore={pieceStore}
            barStore={barStore}
            oscillatorStore={oscillatorStore}
            tableStore={tableStore}
            type="piece"
        />
    );
}

export default PieceList;
