import React from "react";

import classes from "./Inputbox.module.css";

const InputBox = (props) => {
    return (
        <div className={classes.InputBox}>
            <input
                type="text"
                name=""
                id=""
                value={props.msgToSend}
                placeholder="Text Here!"
                onChange={props.onChangeHandler}
                onKeyPress={(event) => {
                    if (event.which === 13) {
                        props.onSubmitHandler();
                    }
                }}
            />
            <button onClick={props.onSubmitHandler}>Send</button>
        </div>
    );
};

export default InputBox;
