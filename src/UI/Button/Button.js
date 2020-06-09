import React from "react";
import classes from "./Button.module.css";

const Button = (props) => {
    let classList = [classes.Button];
    if(props.xs) {
        classList = [classes.XSButton];
    }
    if (props.block) {
        classList.push(classes.Block);
    }
    if (props.type === "primary") {
        classList.push(classes.Primary);
    }
    if (props.type === "secondary") {
        classList.push(classes.Secondary);
    }
    classList = classList.join(" ");

    return (
        <button
            className={classList}
            disabled={props.disabled}
            onClick={props.onClickHandler}
        >
            {props.children}
        </button>
    );
};

export default Button;
