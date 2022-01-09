import React from "react";
import { observer } from "mobx-react";
import TableTab from "../TableTab/TableTab";
import "./Table.css";

class Table extends React.Component {
    componentDidMount() {
        this.props.pieceStore.getPiecesAsync();
        this.props.barStore.getBarsAsync();
    }
    onClickEventHandler = (e) => {
        this.props.pieceStore.toggleTabs();
    };
    render() {
        const pieceTab = this.props.pieceStore.pieceTab;
        return (
            <div className="tableWrapper">
                <div className="Tabs">
                    <button
                        className="Tab"
                        id={pieceTab ? "" : "active"}
                        onClick={this.onClickEventHandler}
                    >
                        Piece
                    </button>
                    <button
                        className="Tab"
                        id={pieceTab ? "active" : ""}
                        onClick={this.onClickEventHandler}
                    >
                        Bars
                    </button>
                </div>
                <TableTab
                    pieceStore={this.props.pieceStore}
                    barStore={this.props.barStore}
                    oscillatorStore={this.props.oscillatorStore}
                />
            </div>
        );
    }
}

export default observer(Table);
