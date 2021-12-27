import React from "react";
import { observer } from "mobx-react";

class Table extends React.Component {
    componentDidMount() {
        this.props.stateManager.getPiecesAsync();
    }

    render() {
        const allPieces = this.props.stateManager.allPieces;
        return (
            <h3>
                {allPieces.map((piece, idx) => {
                    return idx;
                })}
            </h3>
        );
    }
}

export default observer(Table);
