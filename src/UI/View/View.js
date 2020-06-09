import React from "react";
import classes from "./View.module.css";

const View = (props) => {
    return (
        <div className={classes.View}>
            <img
                style={props.style}
                className={classes.ViewImg}
                src={props.path}
                alt="view"
            />
            {props.children}
        </div>
    );
};

export default View;
