import React from "react";

import ShadowBox from "../../../UI/ShadowBox/ShadowBox";
import Search from "../../../UI/Search/Search";
import View from "../../../UI/View/View";
import Alert from "../../../UI/Alert/Alert";
import findPeopleSrc from "../../../assets/icons/findpeople.svg";
import emptyViewSrc from "../../../assets/icons/empty.svg";
import axios from "../../../axios-instances/axios";
import { connect } from "react-redux";
import UserCard from "../../../UI/UserCard/UserCard";
import Spinner from "../../../UI/Spinner/Spinner";

class FindFriends extends React.Component {
    state = {
        search: {
            query: "",
            results: [],
        },
        alert: null,
    };

    onChangeHandler = (event) => {
        this.setState({
            search: {
                query: event.target.value,
                results: [],
            },
            alert: null,
        });

        if (event.target.value.length) {
            axios
                .get(`/friends/find/${event.target.value}`, {
                    headers: {
                        "x-auth-token": this.props.authToken,
                    },
                })
                .then((response) => {
                    this.setState({
                        search: {
                            ...this.state.search,
                            results: response.data,
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
                });
        }
    };

    onSendRequestHandler = (recieverId) => {
        this.setState({ loading: true });
        axios
            .post(
                "/requests/",
                { recieverId: recieverId },
                {
                    headers: {
                        "x-auth-token": this.props.authToken,
                    },
                }
            )
            .then((response) => {
                this.setState({
                    alert: {
                        type: "success",
                        message: response.data,
                    },
                });
                this.toggleButton(recieverId);
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
    };

    onCancelRequestHandler = (recieverId) => {
        this.setState({ loading: true });
        axios
            .delete(`/requests/${recieverId}`, {
                headers: {
                    "x-auth-token": this.props.authToken,
                },
            })
            .then((response) => {
                this.setState({
                    alert: {
                        type: "default",
                        message: response.data,
                    },
                });
                this.toggleButton(recieverId);
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
    };

    toggleButton = (recieverId) => {
        let results = [...this.state.search.results];
        let index = results.findIndex((user) => user._id === recieverId);
        results[index].hasRequested = !results[index].hasRequested;
        this.setState({
            search: {
                ...this.state.search,
                results: results,
            },
        });
    };

    render() {
        let content = null;
        if (!this.state.search.query.length) {
            content = (
                <View style={{ height: "20rem" }} path={findPeopleSrc}>
                    Search For Your Friends...
                </View>
            );
        }
        if (
            !this.state.search.results.length &&
            this.state.search.query.length
        ) {
            content = (
                <View style={{ height: "20rem" }} path={emptyViewSrc}>
                    Did'nt Find Anything Yet!
                </View>
            );
        }

        if (this.state.search.results.length) {
            let results = this.state.search.results;
            content = results.map((result) => {
                if (!result.hasRequested) {
                    return (
                        <UserCard
                            data={result}
                            type="personUnRequested"
                            primaryAction={() =>
                                this.onSendRequestHandler(result._id)
                            }
                        />
                    );
                } else {
                    return (
                        <UserCard
                            data={result}
                            type="personRequested"
                            secondaryAction={() =>
                                this.onCancelRequestHandler(result._id)
                            }
                        />
                    );
                }
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
            <ShadowBox>
                {this.state.loading && <Spinner size="10" />}
                <Search onChangeHandler={this.onChangeHandler} />
                {alert}
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

export default connect(mapStateToProps)(FindFriends);
