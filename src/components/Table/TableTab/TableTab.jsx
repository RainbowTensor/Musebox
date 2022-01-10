import React from "react";
import { observer } from "mobx-react";
import "./TableTab.css";

class TableTab extends React.Component {
    onClickEvantHandler = (e, idx) => {
        if (this.props.pieceStore.pieceTab) {
            this.props.pieceStore.setPiece(idx);
        } else {
            this.props.pieceStore.setBar(idx);
        }
        this.props.pieceStore.toggleTableView();
        this.props.oscillatorStore.toggleOscillatorView();
    };
    newPieceEventHandler = (e) => {
        this.props.pieceStore.toggleTableView();
        this.props.oscillatorStore.toggleOscillatorView();
    };
    deleteEventHandler = (e, idx) => {
        if (this.props.pieceStore.pieceTab) {
            this.props.pieceStore.deletePieceAsync(idx);
        } else {
            this.props.barStore.deleteBarsAsync({ barId: null, barIdx: idx });
            this.props.barStore.deleteBarsView(idx);
        }
    };
    filterEventHandler = (e, idx) => {
        this.props.pieceStore.filterBars(idx);
    };
    allBarsEventHandler = (e) => {
        this.props.barStore.resetViewBars();
    };
    render() {
        const pieceTab = this.props.pieceStore.pieceTab;
        const allPieces = this.props.pieceStore.allPieces;
        let data;
        if (pieceTab) {
            data = allPieces;
        } else {
            data = this.props.barStore.viewBars;
        }
        return (
            <div className="Table">
                <div className="tableHead">
                    <h3>{pieceTab ? "Piece Name" : "Bar ID"}</h3>
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
                                                this.filterEventHandler(
                                                    e,
                                                    pieceIdx
                                                );
                                            }}
                                        >
                                            {piece.name}
                                        </h4>
                                    );
                                })}
                                <h4
                                    className="menuItem"
                                    onClick={this.allBarsEventHandler}
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
                                            this.onClickEvantHandler(
                                                e,
                                                pieceIdx
                                            )
                                        }
                                    >
                                        {pieceTab ? piece.name : piece.id}
                                    </td>
                                    <td>
                                        <button
                                            onClick={(e) => {
                                                this.deleteEventHandler(
                                                    e,
                                                    pieceIdx
                                                );
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
                            <tr
                                className="newPiece"
                                onClick={this.newPieceEventHandler}
                            >
                                <td>New Piece</td>
                            </tr>
                        </>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default observer(TableTab);
