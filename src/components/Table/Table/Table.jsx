import React from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";
import TableTab from "../TableTab/TableTab";
import Popup from "../../Popup/Popup";
import "./Table.css";

class Table extends React.Component {
    componentDidMount() {
        this.props.pieceStore.getPiecesAsync();
        this.props.barStore.getBarsAsync();
    }
    //onClickEventHandler = (e) => {
    //    this.props.pieceStore.toggleTabs();
    //};
    confirmEventHandler = (e, pieceTab) => {
        this.props.pieceStore.showPopup();
        this.props.pieceStore.deletePieceAndBars(pieceTab);
        //this.props.tableStore.confirmDelete();
    };
    declineEventHandler = (e) => {
        this.props.pieceStore.showPopup();
        //this.props.tableStore.showPopup();
    };
    render() {
        const pieceTab = this.props.type === "piece" ? true : false;
        const data = pieceTab
            ? this.props.pieceStore.allPieces
            : this.props.barStore.viewBars;
        return (
            <div className="tableWrapper">
                <div className="Tabs">
                    <Link
                        to="/list/piece"
                        className="Tab"
                        id={pieceTab ? "" : "active"}
                        //onClick={this.onClickEventHandler}
                    >
                        Piece
                    </Link>
                    <Link
                        to="/list/bar"
                        className="Tab"
                        id={pieceTab ? "active" : ""}
                        //onClick={this.onClickEventHandler}
                    >
                        Bars
                    </Link>
                </div>
                <TableTab
                    pieceStore={this.props.pieceStore}
                    barStore={this.props.barStore}
                    oscillatorStore={this.props.oscillatorStore}
                    data={data}
                    type={this.props.type}
                />
                {this.props.pieceStore.popupView && (
                    <Popup>
                        {this.props.pieceStore.pieceTab
                            ? "You are about to delete Piece and all of its Bars. Do you wish to proceed?"
                            : "You are about to delete a Bar. Do you wish to proceed?"}
                        <div>
                            <button
                                onClick={(e) =>
                                    this.confirmEventHandler(e, pieceTab)
                                }
                            >
                                Yes
                            </button>
                            <button onClick={this.declineEventHandler}>
                                No
                            </button>
                        </div>
                    </Popup>
                )}
            </div>
        );
    }
}

export default observer(Table);
