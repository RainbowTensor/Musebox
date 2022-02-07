import React from "react";
import { observer } from "mobx-react";

import Popup from "../Popup/Popup";
import "./Bars.css";

class Bars extends React.Component {
    onClickEventHandler = (e, idx) => {
        this.props.pieceStore.changeActiveBar(idx);
    };
    onRightClickEventHandler = (e, idx) => {
        e.preventDefault();
        this.props.pieceStore.deleteBar(idx);
    };
    uploadEventHandler = (e) => {
        if (this.props.pieceStore.name) {
            this.props.pieceStore.uploadPiece();
        } else {
            this.props.pieceStore.showPopup();
        }
    };
    okEventHandler = (e) => {
        this.props.pieceStore.showPopup();
    };
    uploadOkEventHandler = (e) => {
        this.props.pieceStore.showUploadPopup();
    };
    addBarEventHandler = (e) => {
        this.props.pieceStore.addBar();
    };
    playPieceEventHandler = (e) => {
        this.props.pieceStore.playPiece();
    };
    render() {
        const bars = this.props.pieceStore.bars;
        const activeBarIdx = this.props.pieceStore.activeBarIdx;
        return (
            <>
                <div className="barsWrapper">
                    <div className="Bars">
                        {bars.map((bar, idx) => {
                            const buttonName =
                                idx === activeBarIdx ? "barOn" : "barOff";
                            return (
                                <button
                                    className={buttonName}
                                    key={idx}
                                    title="Right click to remove"
                                    onClick={(e) => {
                                        this.onClickEventHandler(e, idx);
                                    }}
                                    onContextMenu={(e) =>
                                        this.onRightClickEventHandler(e, idx)
                                    }
                                ></button>
                            );
                        })}
                        <button
                            id="addButton"
                            title="Add a Bar"
                            onClick={this.addBarEventHandler}
                        >
                            +
                        </button>
                    </div>
                    <div className="playUpload">
                        <button
                            className="playPieceButton"
                            onClick={this.playPieceEventHandler}
                        >
                            {!this.props.pieceStore.piecePlaying
                                ? "Play Piece"
                                : "Stop"}
                        </button>
                        <button
                            className="uploadButton"
                            onClick={this.uploadEventHandler}
                        >
                            Upload
                        </button>
                    </div>
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
                {this.props.pieceStore.uploadPopupView && (
                    <Popup id="bars">
                        Piece uploaded successfully.
                        <div>
                            <button
                                className="popupBttn"
                                onClick={this.uploadOkEventHandler}
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
