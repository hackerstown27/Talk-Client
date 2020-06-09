import React from "react";

import classes from "./MessageBox.module.css";
import Alert from "../../../UI/Alert/Alert";
import { connect } from "react-redux";

class MessageBox extends React.Component {
    msgRef = React.createRef();

    componentDidMount() {
        this.msgRef.current.scrollTop = this.msgRef.current.scrollHeight;
    }

    componentDidUpdate() {
        this.msgRef.current.scrollTop = this.msgRef.current.scrollHeight;
    }

    render() {
        let content = null;
        if (this.props.messages.length) {
            content = this.props.messages.map((msgDetails, index) => {
                let classType = classes.Sender;
                let style = { textAlign: "right" };
                if (msgDetails.from === this.props.selectedUser._id) {
                    classType = classes.Reciever;
                    style = {};
                }
                return (
                    <div style={style} key={index}>
                        <span className={classType}>
                            {msgDetails.body.message}
                        </span>
                    </div>
                );
            });
        } else {
            content = (
                <h3 className={classes.SayHi}>Say Hi To Start Conversation.</h3>
            );
        }

        if (this.props.alert) {
            content = (
                <Alert
                    style={{ marginTop: "0rem" }}
                    type={this.props.alert.type}
                >
                    {this.props.alert.message}
                </Alert>
            );
        }
        return (
            <div className={classes.MessageBox} ref={this.msgRef}>
                {content}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ...state.auth,
    };
};

export default connect(mapStateToProps)(MessageBox);
