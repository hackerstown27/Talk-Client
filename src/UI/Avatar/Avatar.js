import React from "react";

import classes from "./Avatar.module.css";

const Avatar = (props) => {
    const style = {
        height: props.size + "rem",
        width: props.size + "rem",
    };
    return (
        <img
            style={style}
            className={classes.Avatar}
            src={props.src}
            alt="avatar"
        />
    );
};

export default Avatar;
