import React from "react";

import Search from "../../../UI/Search/Search";
import classes from "./Inbox.module.css";
import UserCard from "../../../UI/UserCard/UserCard";
import View from "../../../UI/View/View";
import Spinner from "../../../UI/Spinner/Spinner";
import Alert from "../../../UI/Alert/Alert";
import emptyInboxSrc from "../../../assets/icons/emptyInbox.svg";
import axios from "../../../axios-instances/axios";
import { handleQuery } from "../../../utility";

class Inbox extends React.Component {
    state = {
        search: {
            query: "",
            results: [],
        },
        inbox: [],
        loading: false,
        alert: null,
    };
    intervalKey = null;
    componentDidMount() {
        this.setState({ loading: true });
        this.intervalKey = setInterval(() => {
            axios
                .get(`/messages/inbox`, {
                    headers: {
                        "x-auth-token": this.props.authToken,
                    },
                })
                .then((response) => {
                    this.setState({
                        inbox: response.data,
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
    }

    componentWillUnmount() {
        clearInterval(this.intervalKey);
    }

    onQueryChangeHandler = (event) => {
        const results = [];
        const friends = this.state.inbox;

        friends.forEach((friend) => {
            let re = RegExp(`^${handleQuery(event.target.value)}`);
            if (re.test(friend.name)) {
                results.push(friend);
            }
        });

        this.setState({
            search: {
                query: event.target.value,
                results: results,
            },
        });
    };

    render() {
        let content = null;
        if (
            !this.state.inbox.length ||
            (this.state.search.query.length &&
                !this.state.search.results.length)
        ) {
            content = (
                <View
                    style={{
                        height: "10rem",
                        paddingTop: "5rem",
                    }}
                    path={emptyInboxSrc}
                >
                    Empty Inbox
                </View>
            );
        } else {
            let inbox = this.state.inbox;
            if (this.state.search.query.length) {
                inbox = this.state.search.results;
            }
            content = inbox.map((user) => {
                let selected = false;
                if (
                    this.props.selectedUser &&
                    user._id === this.props.selectedUser._id
                ) {
                    selected = true;
                }
                return (
                    <div key={user._id}>
                        <UserCard
                            data={user}
                            type="inbox"
                            label={user.hasNewMsg ? "new message" : null}
                            onClickHandler={() =>
                                this.props.onSelectUserHandler(user)
                            }
                            selected={selected}
                        />
                        <hr />
                    </div>
                );
            });
        }

        let alert = null;
        if (this.state.alert) {
            alert = (
                <Alert type={this.state.alert.type}>
                    {this.state.alert.message}
                </Alert>
            );
        }
        return (
            <div className={classes.Inbox}>
                {this.state.loading && <Spinner size="10" />}
                <Search
                    value={this.state.search.query}
                    onChangeHandler={this.onQueryChangeHandler}
                />
                {alert}
                <div className={classes.Content}>{content}</div>
            </div>
        );
    }
}

export default Inbox;
