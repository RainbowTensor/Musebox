import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useNavigate, useParams } from "react-router-dom";

import "./TableTab.css";

function TableTab({ pieceStore, barStore, oscillatorStore }) {
    const navigate = useNavigate();
    const { type } = useParams();
    const pieceTab = type === "piece" ? true : false;

    useEffect(() => {
        if (type !== "piece" && pieceStore.pieceTab) {
            pieceStore.toggleTabs();
        }
    });

    const onClickEvantHandler = (e, idx) => {
        if (pieceStore.pieceTab) {
            pieceStore.setPiece(idx);
        } else {
            pieceStore.reset();
            pieceStore.setBar(idx);
        }
        navigate("/oscillator");
    };
    const newPieceEventHandler = (e) => {
        if (pieceStore.id) {
            pieceStore.reset();
        }
        navigate("/oscillator");
    };
    const deleteEventHandler = (e, idx) => {
        pieceStore.setDeleteIdx(idx);
        pieceStore.showPopup();
    };
    const filterEventHandler = (e, idx) => {
        pieceStore.filterBars(idx);
    };
    const sortEventHandler = (e) => {
        if (pieceStore.pieceTab) {
            pieceStore.sortPieces();
        } else {
            barStore.sortBars();
        }
    };
    const allBarsEventHandler = (e) => {
        barStore.resetViewBars();
    };
    const allPieces = pieceStore.allPieces;
    let data;
    if (pieceTab) {
        data = allPieces;
    } else {
        data = barStore.viewBars;
    }
    return (
        <div className="Table">
            <div className="tableHead">
                <h3 className="tabTitle">
                    {pieceTab ? "Piece Name" : "Bar ID"}
                </h3>
                <button className="sortBttn" onClick={sortEventHandler}>
                    Sort
                </button>
                {!pieceTab && (
                    <div className="dropdown">
                        <div className="filter">Filter by Piece</div>
                        <div className="dropMenu">
                            {allPieces.map((piece, pieceIdx) => {
                                return (
                                    <h4
                                        key={pieceIdx}
                                        className="menuItem"
                                        onClick={(e) => {
                                            filterEventHandler(e, pieceIdx);
                                        }}
                                    >
                                        {piece.name}
                                    </h4>
                                );
                            })}
                            <h4
                                className="menuItem"
                                onClick={allBarsEventHandler}
                            >
                                All Bars
                            </h4>
                        </div>
                    </div>
                )}
            </div>
            <table className="tableBody">
                <tbody>
                    {data.map((piece, pieceIdx) => {
                        return (
                            <tr key={pieceIdx}>
                                <td
                                    key={pieceIdx}
                                    onClick={(e) =>
                                        onClickEvantHandler(e, pieceIdx)
                                    }
                                >
                                    {pieceTab ? piece.name : piece.id}
                                </td>
                                <td>
                                    <button
                                        onClick={(e) => {
                                            deleteEventHandler(e, pieceIdx);
                                        }}
                                        className="deleteButton"
                                        title="Delete"
                                    >
                                        X
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                    <>
                        <tr className="newPiece" onClick={newPieceEventHandler}>
                            <td>New Piece</td>
                        </tr>
                    </>
                </tbody>
            </table>
        </div>
    );
}

export default observer(TableTab);
