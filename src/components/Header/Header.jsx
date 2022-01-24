import React from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";

import "./Header.css";

function Header({ pieceStore }) {
    console.log("piece id", pieceStore.id);
    return (
        <div className="headerWrapper">
            <Link to={`/edit/${pieceStore.id}`}>Edit</Link>
            <Link to="/list/piece">List</Link>
            <Link to="/oscillator">Oscillator</Link>
        </div>
    );
}

export default observer(Header);
