import React from "react";

import Messages from "../../../UI/Messages/Messages";
import initialView from "../../../assets/icons/dashboardview.svg";
import View from "../../../UI/View/View";
import Spinner from "../../../UI/Spinner/Spinner";
import { capitalize } from "../../../utility";
import { connect } from "react-redux";
import axios from "../../../axios-instances/axios";

class ChatBox extends React.Component {
    state = {
        messages: [],
        msgToSend: "",
        alert: null,
    };

    componentDidUpdate(prevProps) {
        if (
            prevProps.selectedUser &&
            prevProps.selectedUser._id !== this.props.selectedUser._id
        ) {
            this.loadMessages();
        }

        if (!prevProps.selectedUser) {
            this.loadMessages();
        }
    }

    componentWillUnmount() {
        clearInterval(this.intervalKey);
    }

    onChangeHandler = (event) => {
        this.setState({ msgToSend: event.target.value });
    };

    onSubmitHandler = () => {
        if (this.state.msgToSend.length) {
            axios
                .post(
                    "/messages/",
                    {
                        recieverId: this.props.selectedUser._id,
                        message: this.state.msgToSend,
                    },
                    {
                        headers: {
                            "x-auth-token": this.props.authToken,
                        },
                    }
                )
                .then((response) => {
                    this.setState({
                        messages: [...this.state.messages, response.data],
                        msgToSend: "",
                    });
                })
                .catch((err) => {
                    this.setState({
                        alert: {
                            type: "failure",
                            message: "Something Went Wrong Try Agian!",
                        },
                    });
                });
        }
    };

    intervalKey = null;

    loadMessages = () => {
        this.setState({ loading: true });
        this.intervalKey = setInterval(() => {
            axios
                .get(`/messages/${this.props.selectedUser._id}`, {
                    headers: {
                        "x-auth-token": this.props.authToken,
                    },
                })
                .then((response) => {
                    this.setState({
                        messages: response.data,
                    });
                })
                .catch((err) => {
                    this.setState({
                        alert: {
                            type: "failure",
                            message: "Something Went Wrong Try Agian!",
                        },
                    });
                })
                .finally(() => {
                    this.setState({ loading: false });
                });
        }, 1000);
    };

    render() {
        let content = null;
        if (!this.props.selectedUser) {
            content = (
                <View
                    style={{
                        height: "30rem",
                        padding: "5rem",
                    }}
                    path={initialView}
                />
            );
        } else {
            content = (
                <Messages
                    header={capitalize(this.props.selectedUser.name)}
                    status={this.props.selectedUser.status}
                    messages={this.state.messages}
                    onChangeHandler={this.onChangeHandler}
                    msgToSend={this.state.msgToSend}
                    alert={this.state.alert}
                    onSubmitHandler={this.onSubmitHandler}
                />
            );
        }

        return (
            <div>
                {this.state.loading && <Spinner size="10" />}
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

export default connect(mapStateToProps)(ChatBox);
