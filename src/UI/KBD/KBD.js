import React from "react";
import classes from "./KBD.module.css";

const KBD = (props) => {
    return <span className={classes.KBD}>{props.children}</span>;
};

export default KBD;
