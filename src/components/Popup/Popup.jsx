import React from "react";
import { observer } from "mobx-react";

import "./Popup.css";

function Popup(props) {
    return <div className="popupWrapper">{props.children}</div>;
}

export default observer(Popup);
