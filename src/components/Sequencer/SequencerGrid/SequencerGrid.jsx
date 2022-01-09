import React from "react";
import { observer } from "mobx-react";

import "./SequencerGrid.css";

class SequencerGrid extends React.Component {
    constructor(props) {
        super(props);
        this.onClickEventHandler = this.onClickEventHandler.bind(this);
    }
    onClickEventHandler(e, rowIdx, noteIdx) {
        this.props.store.updateNotes(rowIdx, noteIdx);
    }
    render() {
        const notes = this.props.store.notes;
        return (
            <div className="sequencerGrid">
                {notes.map((row, rowIdx) => {
                    return (
                        <div className="sequencerRow" key={rowIdx}>
                            {row.map((note, noteIdx) => {
                                const buttonName = note.active
                                    ? "noteOn"
                                    : "noteOff";
                                return (
                                    <button
                                        className={buttonName}
                                        key={noteIdx}
                                        onClick={(e) =>
                                            this.onClickEventHandler(
                                                e,
                                                rowIdx,
                                                noteIdx
                                            )
                                        }
                                    ></button>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default observer(SequencerGrid);
