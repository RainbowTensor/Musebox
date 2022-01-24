import React, { Component } from "react";
import { observer } from "mobx-react";

import "./Graph.css";

class Graph extends Component {
    onMouseDownEventHandler = (e, idx) => {
        this.props.store.startMovePoint(e, idx);
    };
    onMouseMoveEventHandler = (e, idx) => {
        this.props.store.movePoint(e, idx);
    };
    onMouseUpEventHandler = (e, idx) => {
        this.props.store.stopMovePoint(idx);
    };
    render() {
        const store = this.props.store;
        const points = store.points;
        return (
            <div className="Graph">
                <svg
                    className="graphArea"
                    width={store.width + store.padding}
                    height={store.height + store.padding}
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
