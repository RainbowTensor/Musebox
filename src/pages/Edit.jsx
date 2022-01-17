import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import Sequencer from "../components/Sequencer/Sequencer/Sequencer";
import Bars from "../components/Bars/Bars";

function Edit({ stores }) {
    const { oscillatorStore, barStore, pieceStore } = stores;
    const { pieceId } = useParams();
    if (pieceId && pieceStore.allPieces.length === 0) {
        pieceStore
            .getPiecesAsync()
            .then(() => barStore.getBarsAsync())
            .then(() => {
                pieceStore.setPieceById(pieceId);
            });
    }
    return (
        <>
            <Sequencer
                barStore={barStore}
                pieceStore={pieceStore}
                oscillatorStore={oscillatorStore}
            />
            <Bars pieceStore={pieceStore} oscillatorStore={oscillatorStore} />
        </>
    );
}

export default Edit;
