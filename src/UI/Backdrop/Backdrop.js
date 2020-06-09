import React from "react";

import classes from "./Backdrop.module.css";

const Backdrop = (props) => {
    return (
        <div className={classes.BackDrop} onClick={props.backdropHandler}>
        </div>
    )
}

export default Backdrop;