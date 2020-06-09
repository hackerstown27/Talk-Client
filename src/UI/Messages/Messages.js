import React from "react";

import classes from "./Messages.module.css";
import Nav from "./Nav/Nav";
import MessageBox from "./MessageBox/MessageBox";
import InputBox from "./InputBox/InputBox";
import { connect } from "react-redux";

const Messages = (props) => {
    return (
        <div className={classes.Messages}>
            <Nav header={props.header} status={props.status} />
            <MessageBox messages={props.messages} alert={props.alert} />
            <InputBox
                onChangeHandler={props.onChangeHandler}
                msgToSend={props.msgToSend}
                onSubmitHandler={props.onSubmitHandler}
            />
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        ...state.auth,
    };
};

export default connect(mapStateToProps)(Messages);
