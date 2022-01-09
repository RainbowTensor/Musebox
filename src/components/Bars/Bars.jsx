import React from "react";
import { observer } from "mobx-react";

import "./Bars.css";

class Bars extends React.Component {
    onClickEventHandler = (e, idx) => {
        this.props.pieceStore.changeActiveBar(idx);
    };
    uploadEventHandler = (e) => {
        this.props.pieceStore.postPieceAsync();
    };
    render() {
        const bars = this.props.pieceStore.bars;
        const activeBarIdx = this.props.pieceStore.activeBarIdx;
        return (
            <div className="Bars">
                {bars.map((bar, idx) => {
                    const buttonName =
                        idx === activeBarIdx ? "barOn" : "barOff";
                    return (
                        <button
                            className={buttonName}
                            key={idx}
                            onClick={(e) => {
                                this.onClickEventHandler(e, idx);
                            }}
                        ></button>
                    );
                })}
                <button
                    className="uploadButton"
                    onClick={this.uploadEventHandler}
                >
                    Upload
                </button>
            </div>
        );
    }
}

export default observer(Bars);
