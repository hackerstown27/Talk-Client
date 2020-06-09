import React from "react";
import classes from "./Alert.module.css";
import { capitalize } from "../../utility";

const Alert = (props) => {
    let classList = [classes.Alert];
    if (props.type === "success") {
        classList.push(classes.Success);
    } else if (props.type === "failure") {
        classList.push(classes.Failure);
    } else {
        classList.push(classes.Info);
    }
    classList = classList.join(" ");
    return (
        <div style={props.style} className={classList}>
            {capitalize(props.children)}
        </div>
    );
};

export default Alert;
