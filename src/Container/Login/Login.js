import React from "react";

import classes from "./Login.module.css";
import View from "../../UI/View/View";
import viewImgSrc from "../../assets/icons/loginsideview.svg";
import Container from "../../UI/Container/Container";
import Input from "../../UI/Input/Input";
import { Link } from "react-router-dom";
import Button from "../../UI/Button/Button";
import { checkValidation } from "../../utility";
import axios from "../../axios-instances/axios";
import { connect } from "react-redux";
import * as actions from "../../store/actions/auth";
import Alert from "../../UI/Alert/Alert";
import Spinner from "../../UI/Spinner/Spinner";

class Login extends React.Component {
    state = {
        inputFields: {
            phoneNo: {
                label: "Phone No",
                config: {
                    type: "phoneNo",
                    placeholder: "Phone No",
                },
                validationRules: {
                    minLen: 10,
                    maxLen: 10,
                },
                isValid: false,
                isTouched: false,
                value: "",
            },
            password: {
                label: "Password",
                config: {
                    type: "password",
                    placeholder: "Password",
                },
                validationRules: {
                    minLen: 6,
                },
                isValid: false,
                isTouched: false,
                value: "",
            },
        },
        proceed: false,
    };

    componentDidMount = () => {
        this.props.onAuthAuto();
        if (this.props.authToken) {
            this.props.history.push("/dashboard");
            const tokenGenOn = new Date(this.props.tokenGenOn);
            const tokenExpOn = new Date(tokenGenOn.getTime() + 3600000);
            const tokenRem = tokenExpOn.getTime() - Date.now();

            setTimeout(() => {
                this.props.onAuthLogout();
            }, tokenRem);
        }
    };

    componentDidUpdate = () => {
        if (this.props.authToken) {
            this.props.history.push("/dashboard");
        }
    };

    onChangeHandler = (event, inputId) => {
        this.setState(checkValidation(event, inputId, this.state.inputFields));
    };

    onSubmitHandler = () => {
        const credentials = {
            phoneNo: this.state.inputFields.phoneNo.value,
            password: this.state.inputFields.password.value,
        };
        this.props.onAuthStart();
        axios
            .post("/auth/login", credentials)
            .then((response) => {
                this.props.onAuthSuccess(response.headers["x-auth-token"]);
                setTimeout(() => {
                    this.props.onAuthLogout();
                }, 3600000);
            })
            .catch((error) => {
                this.props.onAuthFail(error.response.data);
                console.log(error)
            });
    };

    onSignUpHandler = () => {
        this.props.history.push("/sign-up");
    };

    render() {
        const loginFields = Object.keys(this.state.inputFields).map(
            (inputId) => {
                const inputDetails = this.state.inputFields[inputId];
                return (
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
                );
            }
        );

        let alert = null;

        if (this.props.error) {
            alert = <Alert type="failure">{this.props.error}</Alert>;
        }

        return (
            <div className={classes.Login}>
                <View
                    style={{
                        height: "40rem",
                    }}
                    path={viewImgSrc}
                />

                <Container>
                    {this.props.loading ? <Spinner size="10" /> : null}

                    <h1 className={classes.LoginHeader}>
                        Login Into Your Account
                    </h1>

                    {alert}

                    {loginFields}

                    <Button
                        type="primary"
                        disabled={!this.state.proceed}
                        onClickHandler={this.onSubmitHandler}
                        block
                    >
                        Log In
                    </Button>

                    <Button
                        type="secondary"
                        onClickHandler={this.onSignUpHandler}
                        block
                    >
                        SignUp
                    </Button>

                    <Link className={classes.Link} to="/forget-password">
                        Forget Password?
                    </Link>
                </Container>
            </div>
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
        onAuthStart: () => dispatch(actions.onAuthStart()),
        onAuthSuccess: (authToken) =>
            dispatch(actions.onAuthSuccess(authToken)),
        onAuthFail: (error) => dispatch(actions.onAuthFail(error)),
        onAuthAuto: () => dispatch(actions.onAuthAuto()),
        onAuthLogout: () => dispatch(actions.onAuthLogout()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
