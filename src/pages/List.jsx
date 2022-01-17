import React from "react";
import { useParams } from "react-router-dom";
import Table from "../components/Table/Table/Table";

function List({ stores }) {
    const { oscillatorStore, barStore, pieceStore } = stores;
    //const { type } = useParams();
    //console.log("list page", type);
    //pieceStore.toggleTabs(type);
    return (
        <Table
            pieceStore={pieceStore}
            barStore={barStore}
            oscillatorStore={oscillatorStore}
        />
    );
}

export default List;
