import React from "react";

import UserCard from "../../../UI/UserCard/UserCard";
import axios from "../../../axios-instances/axios";
import { connect } from "react-redux";
import Spinner from "../../../UI/Spinner/Spinner";
import ShadowBox from "../../../UI/ShadowBox/ShadowBox";
import Alert from "../../../UI/Alert/Alert";
import Search from "../../../UI/Search/Search";
import classes from "./ViewFriends.module.css";
import { handleQuery } from "../../../utility";
import { capitalize } from "../../../utility";
import Modal from "../../../UI/Modal/Modal";
import KBD from "../../../UI/KBD/KBD";
import View from "../../../UI/View/View";
import emptyViewSrc from "../../../assets/icons/empty.svg";
import { withRouter } from "react-router";
import * as actions from "../../../store/actions/auth";

class ViewFriends extends React.Component {
    state = {
        loading: false,
        friends: null,
        alert: null,
        search: {
            query: "",
            results: [],
        },
        deleteModal: false,
        selectedFriend: null,
    };
    componentDidMount() {
        this.setState({ loading: true });
        axios
            .get("/friends/", {
                headers: {
                    "x-auth-token": this.props.authToken,
                },
            })
            .then((response) => {
                this.setState({ friends: response.data.friends });
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
    }

    onChangeHandler = (event) => {
        const results = [];
        const friends = this.state.friends;

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

    onUnfriendHandler = (friend) => {
        this.setState({ deleteModal: true, selectedFriend: friend });
    };

    onModalCloseHandler = () => {
        this.setState({ deleteModal: false });
    };

    onDeleteHandler = () => {
        let recieverId = this.state.selectedFriend._id;
        this.setState({ loading: true });
        axios
            .delete(`/friends/${recieverId}`, {
                headers: {
                    "x-auth-token": this.props.authToken,
                },
            })
            .then((response) => {
                let friends = [...this.state.friends];
                let results = [...this.state.search.results];
                let friendIndex = friends.findIndex(
                    (friend) => friend._id === recieverId
                );
                let resultIndex = results.findIndex(
                    (friend) => friend._id === recieverId
                );
                friends.splice(friendIndex, 1);
                results.splice(resultIndex, 1);

                this.setState({
                    alert: {
                        type: "default",
                        message: response.data,
                    },
                    friends: friends,
                    search: {
                        ...this.state.search,
                        results: results,
                    },
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
                this.setState({ loading: false, deleteModal: false });
            });
    };

    onMessageHandler = (friend) => {
        this.setState({ loading: true });
        axios
            .post(
                "/messages/addToInbox",
                { recieverId: friend._id },
                {
                    headers: {
                        "x-auth-token": this.props.authToken,
                    },
                }
            )
            .then((response) => {
                this.props.onSelectUserHandler(friend);
                this.props.history.push("/");
            })
            .catch((err) => {
                this.setState({
                    alert: {
                        type: "failure",
                        message: "Something Went Wrong Try Agian!",
                    },
                });
                console.log(err);
            })
            .finally(() => {
                this.setState({ loading: false });
            });
    };

    render() {
        let loading = null;
        if (this.state.loading) {
            loading = <Spinner size="10" />;
        }
        let content = null;
        if (this.state.friends) {
            let friends = this.state.friends;
            if (this.state.search.query.length) {
                friends = this.state.search.results;
            }
            content = friends.map((friend) => {
                return (
                    <UserCard
                        key={friend._id}
                        data={friend}
                        type="friend"
                        primaryAction={() => this.onMessageHandler(friend)}
                        secondaryAction={() => this.onUnfriendHandler(friend)}
                    />
                );
            });
            if (
                !this.state.friends.length ||
                (this.state.search.query.length &&
                    !this.state.search.results.length)
            ) {
                content = (
                    <View style={{ height: "20rem" }} path={emptyViewSrc}>
                        Did'nt Find Anything Yet!
                    </View>
                );
            }
        }
        let modal = null;
        if (this.state.deleteModal) {
            modal = (
                <Modal
                    title="Sure ?"
                    onClose={this.onModalCloseHandler}
                    onDismiss={this.onModalCloseHandler}
                    onProceed={this.onDeleteHandler}
                >
                    <p className={classes.ModalMessage}>
                        You Want To Remove
                        <KBD>{capitalize(this.state.selectedFriend.name)}</KBD>
                        From Your Friends?
                    </p>
                </Modal>
            );
        }
        return (
            <ShadowBox>
                {modal}
                <div className={classes.Search}>
                    <Search
                        value={this.state.search.query}
                        onChangeHandler={this.onChangeHandler}
                    />
                </div>

                {loading}
                {this.state.alert && (
                    <Alert type={this.state.alert.type}>
                        {this.state.alert.message}
                    </Alert>
                )}
                {content}
            </ShadowBox>
        );
    }
}

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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(ViewFriends));
