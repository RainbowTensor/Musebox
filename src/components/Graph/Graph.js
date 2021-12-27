import React, { Component } from "react";
import { observer } from "mobx-react";

import "./Graph.css";

class Graph extends Component {
    constructor(props) {
        super(props);
        this.onMouseDownEventHandler = this.onMouseDownEventHandler.bind(this);
    }
    onMouseDownEventHandler(e, idx) {
        const objState = this.props.stateManager.points[idx];
        if (objState.draggable) {
            this.props.stateManager.updatePoints(
                {
                    x: null,
                    y: null,
                    draggable: null,
                    dragging: true,
                    screenX: e.screenX,
                    screenY: e.screenY,
                },
                idx
            );
        }
    }
    onMouseMoveEventHandler(e, idx) {
        e.preventDefault();
        const objState = this.props.stateManager.points[idx];
        if (objState.dragging & objState.draggable) {
            const shiftX = e.screenX - objState.screenX;
            const shiftY = e.screenY - objState.screenY;

            this.props.stateManager.updatePoints(
                {
                    x: objState.x + shiftX,
                    y: objState.y + shiftY,
                    draggable: null,
                    dragging: null,
                    screenX: e.screenX,
                    screenY: e.screenY,
                },
                idx
            );
        }
    }
    onMouseUpEventHandler(e, idx) {
        const objState = this.props.stateManager.points[idx];
        if (objState.draggable) {
            this.props.stateManager.updatePoints(
                {
                    x: null,
                    y: null,
                    draggable: null,
                    dragging: false,
                    screenX: 0,
                    screenY: 0,
                },
                idx
            );
        }
        this.props.stateManager.claculateADSR();
    }
    render() {
        const stateManager = this.props.stateManager;
        const points = stateManager.points;
        return (
            <div className="Graph">
                <svg
                    className="graphArea"
                    width={stateManager.width + stateManager.padding}
                    height={stateManager.height + stateManager.padding}
                >
                    <polyline
                        points={points.map((coords, i) => {
                            return [coords.x, coords.y];
                        })}
                    ></polyline>
                    {points.map((coords, i) => {
                        return (
                            <circle
                                cx={coords.x}
                                cy={coords.y}
                                r="10"
                                key={i}
                                onMouseDown={(e) =>
                                    this.onMouseDownEventHandler(e, i)
                                }
                                onMouseUp={(e) =>
                                    this.onMouseUpEventHandler(e, i)
                                }
                                onMouseMove={(e) =>
                                    this.onMouseMoveEventHandler(e, i)
                                }
                            />
                        );
                    })}
                </svg>
            </div>
        );
    }
}

export default observer(Graph);
