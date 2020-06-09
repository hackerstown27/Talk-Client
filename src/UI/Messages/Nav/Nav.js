import React from "react";

import classes from "./Nav.module.css";

const Nav = (props) => {
    let statusClass = null;
    if (props.status === "online") {
        statusClass = classes.Online;
    } else if (props.status === "offline") {
        statusClass = classes.Offline;
    } else if (props.status === "away") {
        statusClass = classes.Away;
    }
    return (
        <nav className={classes.Nav}>
            <span className={statusClass}></span>
            <span className={classes.Header}>{props.header}</span>
        </nav>
    );
};

export default Nav;
