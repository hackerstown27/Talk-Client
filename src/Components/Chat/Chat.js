import React from "react";

import Inbox from "./Inbox/Inbox";
import ChatBox from "./ChatBox/ChatBox";
import classes from "./Chat.module.css";
// import openSocket from "socket.io-client"

import { connect } from "react-redux";
import * as actions from "../../store/actions/auth";

// const socket = openSocket('http://localhost:5000');

const Chat = (props) => {
    return (
        <div className={classes.Chat}>
            <Inbox {...props} />
            <ChatBox {...props} />
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        ...state.auth,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSelectUserHandler: (user) =>
            dispatch(actions.onSelectUserHandler(user)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
