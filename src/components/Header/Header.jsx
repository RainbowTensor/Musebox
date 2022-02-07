import React from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react";

import "./Header.css";

function Header({ pieceStore }) {
    return (
        <div className="headerWrapper">
            {pieceStore.id ? (
                <Link to={`/edit/${pieceStore.id}`}>Editor</Link>
            ) : (
                <Link to="/create">Editor</Link>
            )}
            <Link to="/list/piece">List</Link>
            <Link to="/oscillator">Oscillator</Link>
        </div>
    );
}

export default observer(Header);
