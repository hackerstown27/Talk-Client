import React from "react";
import classes from "./ShadowBox.module.css";

const ShadowBox = (props) => {
    return (
        <div className={classes.ShadowBox}>
            {props.children}
        </div>
    )
}

export default ShadowBox;