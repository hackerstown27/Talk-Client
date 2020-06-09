import React from "react";

import Spinner from "../../UI/Spinner/Spinner";
import View from "../../UI/View/View";
import errorView from "../../assets/icons/serverdown.svg";
import axios from "../../axios-instances/axios";
import { connect } from "react-redux";
import * as actions from "../../store/actions/auth";
import ProfileCard from "../../UI/ProfileCard/ProfileCard";
import { checkValidation } from "../../utility";
import Alert from "../../UI/Alert/Alert";

class Profile extends React.Component {
    state = {
        profileData: null,
        loading: true,
        error: null,
        showDeleteModal: false,
        alert: null,
        inputFields: {
            status: {
                label: "Status",
                config: {
                    type: "select",
                    options: [
                        { displayValue: "Online", value: "online" },
                        { displayValue: "Offline", value: "offline" },
                        { displayValue: "Away", value: "away" },
                    ],
                },
                validationRules: {},
                isValid: true,
                isTouched: true,
                value: "online",
            },
            file: {
                label: "Edit Profile Pic",
                config: {
                    type: "file",
                },
                validationRules: {
                    mimeTypes: ["image/jpeg", "image/jpg", "image/png"],
                },
                value: "",
                file: null,
            },
        },
    };

    componentDidMount() {
        axios
            .get("/users", {
                headers: {
                    "x-auth-token": this.props.authToken,
                },
            })
            .then((response) => {
                this.setState({
                    profileData: response.data,
                    loading: false,
                    error: null,
                });
            })
            .catch((error) => {
                this.setState({
                    loading: false,
                    error: error.response.data,
                });
            });
    }

    onChangeHandler = (event, inputId) => {
        this.setState(checkValidation(event, inputId, this.state.inputFields));
    };

    onDeleteHandler = () => {
        this.setState({ loading: true });
        axios
            .delete("/users", {
                headers: {
                    "x-auth-token": this.props.authToken,
                },
            })
            .then(() => {
                this.setState({ loading: false });
                this.props.onLogoutHandler();
            })
            .catch((error) => {
                this.setState({ loading: false });
                this.setState({ error: error.response.data });
            });
    };

    onEditHander = () => {
        this.setState({ loading: true });
        const formData = new FormData();
        formData.append("profilePic", this.state.inputFields.file.file);
        formData.append("status", this.state.inputFields.status.value);
        axios
            .put("/users", formData, {
                headers: {
                    "x-auth-token": this.props.authToken,
                },
            })
            .then((response) => {
                this.setState({
                    profileData: response.data,
                    loading: false,
                    error: null,
                    alert: {
                        type: "success",
                        message: "Profile Updated Successfully!",
                    },
                });
            })
            .catch((error) => {
                this.setState({ error: error.response.data, loading: false });
            });
    };

    render() {
        let content = <Spinner size="10" />;
        let alert = this.state.alert;
        if (this.state.profileData && !this.state.loading) {
            content = (
                <React.Fragment>
                    <div style={{ width: "65vw", margin: "0 auto" }}>
                        {alert && (
                            <Alert type={alert.type}>{alert.message}</Alert>
                        )}
                    </div>

                    <ProfileCard
                        onChangeHandler={this.onChangeHandler}
                        inputFields={this.state.inputFields}
                        profileData={this.state.profileData}
                        onDeleteHandler={this.onDeleteHandler}
                        onEditHandler={this.onEditHander}
                    />
                </React.Fragment>
            );
        }
        if (this.state.error) {
            content = (
                <View
                    style={{ height: "20rem", padding: "5rem" }}
                    path={errorView}
                >
                    Something Went Wrong Please Try Again !...
                </View>
            );
        }
        return content;
    }
}

const mapStateToProps = (state) => {
    return {
        authToken: state.auth.authToken,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onLogoutHandler: () => dispatch(actions.onAuthLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
