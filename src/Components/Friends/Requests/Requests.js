import React from "react";

import ShadowBox from "../../../UI/ShadowBox/ShadowBox";
import Search from "../../../UI/Search/Search";
import View from "../../../UI/View/View";
import UserCard from "../../../UI/UserCard/UserCard";
import Alert from "../../../UI/Alert/Alert";
import Spinner from "../../../UI/Spinner/Spinner";
import emptyViewSrc from "../../../assets/icons/empty.svg";
import axios from "../../../axios-instances/axios";
import { connect } from "react-redux";
import { handleQuery } from "../../../utility";

class Requests extends React.Component {
    state = {
        search: {
            query: "",
            results: [],
        },
        requests: [],
        loading: false,
        alert: null,
    };

    componentDidMount() {
        this.setState({ loading: true });
        axios
            .get("/requests/", {
                headers: {
                    "x-auth-token": this.props.authToken,
                },
            })
            .then((response) => {
                this.setState({
                    requests: response.data.requests,
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
    }

    onChangeHandler = (event) => {
        const results = [];
        const requests = this.state.requests;

        requests.forEach((request) => {
            let re = RegExp(`^${handleQuery(event.target.value)}`);
            if (re.test(request.name)) {
                results.push(request);
            }
        });

        this.setState({
            search: {
                query: event.target.value,
                results: results,
            },
        });
    };

    onAcceptHandler = (recieverId) => {
        this.onActionHandler("accept", recieverId);
    };

    onDeclineHandler = (recieverId) => {
        this.onActionHandler("decline", recieverId);
    };

    onActionHandler = (type, recieverId) => {
        let url = null;
        let alertType = null;
        if (type === "accept") {
            url = "/requests/accept/";
            alertType = "success";
        } else if (type === "decline") {
            url = "/requests/decline/";
            alertType = "default";
        }
        this.setState({ loading: true });
        axios
            .put(
                url,
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
                        type: alertType,
                        message: response.data,
                    },
                });
                this.updateRequests(recieverId);
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

    updateRequests = (recieverId) => {
        let requests = [...this.state.requests];
        let results = [...this.state.search.results];
        let requestsIndex = requests.findIndex(
            (request) => request._id === recieverId
        );
        let resultIndex = results.findIndex(
            (request) => request._id === recieverId
        );

        requests.splice(requestsIndex, 1);
        results.splice(resultIndex, 1);
        this.setState({
            requests: requests,
            search: {
                ...this.state.search,
                results: results,
            },
        });
    };

    render() {
        let content = null;
        if (
            !this.state.requests.length ||
            (this.state.search.query.length &&
                !this.state.search.results.length)
        ) {
            content = (
                <View style={{ height: "20rem" }} path={emptyViewSrc}>
                    We have nothing for you...
                </View>
            );
        } else if (this.state.requests.length) {
            let results = this.state.requests;
            if (this.state.search.query.length) {
                results = this.state.search.results;
            }
            content = results.map((data) => {
                return (
                    <UserCard
                        type="request"
                        data={data}
                        primaryAction={() => {
                            this.onAcceptHandler(data._id);
                        }}
                        secondaryAction={() => {
                            this.onDeclineHandler(data._id);
                        }}
                    />
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

export default connect(mapStateToProps)(Requests);
