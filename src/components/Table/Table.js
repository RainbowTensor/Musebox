import React from "react";
import { observer } from "mobx-react";
import "./Table.css";

class Table extends React.Component {
    componentDidMount() {
        this.props.stateManager.getPiecesAsync();
    }
    onClickEvantHandler = (e, idx) => {
        console.log("clicked", idx);
        this.props.stateManager.setNotes(idx);
        this.props.stateManager.toggleTableView();
        // this.props.stateManager.toggleOscillatorView();
    };
    newPieceEventHandler = (e) => {
        this.props.stateManager.toggleTableView();
        this.props.stateManager.toggleOscillatorView();
        const comf = window.confirm("name your piece");
        console.log("confirm", comf);
    };
    render() {
        const allPieces = this.props.stateManager.allPieces;
        return (
            <div className="tableWrapper">
                <table className="Table">
                    <thead>
                        <tr>
                            <th>Piece ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allPieces.map((piece, pieceIdx) => {
                            return (
                                <tr
                                    key={pieceIdx}
                                    onClick={(e) =>
                                        this.onClickEvantHandler(e, pieceIdx)
                                    }
                                >
                                    <td key={pieceIdx}>{piece.id}</td>
                                </tr>
                            );
                        })}
                        <tr onClick={this.newPieceEventHandler}>
                            <td>New Piece</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

export default observer(Table);
