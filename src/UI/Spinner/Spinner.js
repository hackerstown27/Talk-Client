import React from "react";
import classes from "./Spinner.module.css";

const Spinner = (props) => {
    const style = {
        width: props.size + "rem",
        height: props.size + "rem",
        marginLeft: -Number(props.size) / 2 + "rem",
        marginTop: -Number(props.size) / 2 + "rem",
    };
    return (
        <div className={classes.Container}>
            <div style={style} className={classes.Spinner}></div>
        </div>
    );
};

export default Spinner;
