import React from "react";

import classes from "./ChangePassword.module.css";
import changePasswordView from "../../assets/icons/changepasswordview.svg";
import View from "../../UI/View/View";
import Input from "../../UI/Input/Input";
import { checkValidation } from "../../utility";
import Button from "../../UI/Button/Button";
import axios from "../../axios-instances/axios";
import Alert from "../../UI/Alert/Alert";
import Spinner from "../../UI/Spinner/Spinner";
import { connect } from "react-redux";

class ChangePassword extends React.Component {
    state = {
        inputFields: {
            oldPassword: {
                label: "Old Password",
                config: {
                    type: "password",
                    placeholder: "",
                },
                validationRules: {
                    minLen: 6,
                },
                isValid: false,
                isTouched: false,
                value: "",
            },
            newPassword: {
                label: "New Password",
                config: {
                    type: "password",
                    placeholder: "",
                },
                validationRules: {
                    minLen: 6,
                },
                isValid: false,
                isTouched: false,
                value: "",
            },
            confirmPassword: {
                label: "Confirm Password",
                config: {
                    type: "password",
                    placeholder: "",
                },
                validationRules: {
                    minLen: 6,
                    matchTo: "newPassword",
                },
                isValid: false,
                isTouched: false,
                value: "",
            },
        },
        proceed: false,
        alert: null,
        loading: false,
    };

    onChangeHandler = (event, inputId) => {
        this.setState(checkValidation(event, inputId, this.state.inputFields));
    };

    onSubmitHandler = (event) => {
        event.preventDefault();
        const data = {
            oldPassword: this.state.inputFields.oldPassword.value,
            newPassword: this.state.inputFields.newPassword.value,
        };
        this.setState({ loading: true });
        axios
            .put("/auth/changePassword", data, {
                headers: {
                    "x-auth-token": this.props.authToken,
                },
            })
            .then((response) => {
                this.setState({
                    alert: {
                        message: response.data,
                        type: "success",
                    },
                    loading: false,
                });
            })
            .catch((error) => {
                console.log(error.response.data);
                this.setState({
                    alert: {
                        message: error.response.data,
                        type: "failure",
                    },
                    loading: false,
                });
            });
        console.log(this.props.authToken);
    };

    render() {
        const fields = Object.keys(this.state.inputFields).map((inputId) => {
            const inputDetails = this.state.inputFields[inputId];
            return (
                <label key={inputId}>
                    {inputDetails.label}
                    <br />
                    <Input
                        config={inputDetails.config}
                        key={inputDetails.label}
                        value={inputDetails.value}
                        onChangeHandler={(event) => {
                            this.onChangeHandler(event, inputId);
                        }}
                        isValid={inputDetails.isValid}
                        isTouched={inputDetails.isTouched}
                    />
                </label>
            );
        });

        let alert = null;

        if (this.state.alert) {
            alert = (
                <Alert type={this.state.alert.type}>
                    {this.state.alert.message}
                </Alert>
            );
        }
        return (
            <div className={classes.changePassword}>
                <View
                    style={{ paddingTop: "2rem", height: "25rem" }}
                    path={changePasswordView}
                />
                <div>
                    <h2 className={classes.heading}>Secure Your Account ...</h2>
                    <form className={classes.changePasswordForm}>
                        {this.state.loading ? <Spinner size="10" /> : null}
                        {alert}
                        {fields}
                        <Button
                            type="primary"
                            disabled={!this.state.proceed}
                            onClickHandler={this.onSubmitHandler}
                        >
                            Proceed
                        </Button>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authToken: state.auth.authToken,
    };
};

export default connect(mapStateToProps)(ChangePassword);
