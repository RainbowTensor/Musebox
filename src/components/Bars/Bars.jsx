import React from "react";
import { observer } from "mobx-react";

import Popup from "../Popup/Popup";
import "./Bars.css";

class Bars extends React.Component {
    onClickEventHandler = (e, idx) => {
        this.props.pieceStore.changeActiveBar(idx);
    };
    uploadEventHandler = (e) => {
        if (this.props.pieceStore.name) {
            this.props.pieceStore.postPieceAsync();
        } else {
            this.props.pieceStore.showPopup();
        }
    };
    okEventHandler = (e) => {
        this.props.pieceStore.showPopup();
    };
    render() {
        const bars = this.props.pieceStore.bars;
        const activeBarIdx = this.props.pieceStore.activeBarIdx;
        return (
            <>
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
                {this.props.pieceStore.popupView && (
                    <Popup id="bars">
                        Piece name is not set! Please set the name to upload.
                        <div>
                            <button
                                className="popupBttn"
                                onClick={this.okEventHandler}
                            >
                                Ok
                            </button>
                        </div>
                    </Popup>
                )}
            </>
        );
    }
}

export default observer(Bars);
