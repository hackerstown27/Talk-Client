import React from "react";

import classes from "./Register.module.css";
import Container from "../../UI/Container/Container";
import View from "../../UI/View/View";
import viewImgSrc from "../../assets/icons/welcome.svg";
import { Link } from "react-router-dom";
import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";
import { checkValidation } from "../../utility";
import axios from "../../axios-instances/axios";
import { connect } from "react-redux";
import * as actions from "../../store/actions/auth";
import Alert from "../../UI/Alert/Alert";
import Spinner from "../../UI/Spinner/Spinner";
import Modal from "../../UI/Modal/Modal";

class Register extends React.Component {
    state = {
        inputFields: {
            name: {
                label: "First Name",
                config: {
                    type: "text",
                    placeholder: "Full Name",
                },
                validationRules: {
                    isRequired: true,
                    minLen: 3,
                    maxLen: 255,
                },
                isValid: false,
                isTouched: false,
                value: "",
            },
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
                    isRequired: true,
                    minLen: 6,
                },
                isValid: false,
                isTouched: false,
                value: "",
            },
            gender: {
                label: "Gender",
                config: {
                    type: "select",
                    options: [
                        { displayValue: "Male", value: "male" },
                        { displayValue: "Female", value: "female" },
                    ],
                },
                validationRules: {},
                isValid: true,
                isTouched: true,
                value: "male",
            },
            dob: {
                label: "Date of Birth",
                config: {
                    type: "date",
                },
                validationRules: {
                    isRequired: true,
                },
                isValid: false,
                isTouched: false,
                value: "",
            },
        },
        modalFields: {
            otp: {
                label: "OTP",
                config: {
                    type: "otp",
                    placeholder: "------",
                },
                validationRules: {
                    minLen: 6,
                    maxLen: 6,
                },
                isValid: false,
                isTouched: false,
                value: "",
            },
        },
        procced: false,
        showOTPModal: false,
        alert: null,
        loading: false,
    };

    componentDidMount = () => {
        this.props.onAuthAuto();
        if (this.props.authToken) {
            this.props.history.push("/dashboard");
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

    onModalChangeHandler = (event, inputId) => {
        this.setState({
            modalFields: checkValidation(
                event,
                inputId,
                this.state.modalFields,
                false
            ),
        });
    };

    onCloseOTPModal = () => {
        this.setState({ showOTPModal: false, modalAlert: null });
        this.resetModalFields();
    };

    resetModalFields = () => {
        const modalFields = {
            ...this.state.modalFields,
            otp: {
                ...this.state.modalFields.otp,
                isValid: false,
                isTouched: false,
                value: "",
            },
        };
        this.setState({ modalFields: modalFields });
    };

    onSubmitHandler = () => {
        const data = {};

        for (let inputElm in this.state.inputFields) {
            data[inputElm] = this.state.inputFields[inputElm].value;
        }

        this.setState({ loading: true });
        axios
            .post("/users", data)
            .then((response) => {
                this.setState({
                    alert: { type: "success", message: response.data },
                    showOTPModal: true,
                    loading: false,
                });
            })
            .catch((err) => {
                this.setState({
                    alert: { type: "failure", message: err.response.data },
                    loading: false,
                });
            });
    };

    onOTPSubmitHandler = () => {
        const data = {
            phoneNo: this.state.inputFields.phoneNo.value,
            otp: this.state.modalFields.otp.value,
        };
        this.props.onAuthStart();
        axios
            .post("/users/verify", data)
            .then((response) => {
                this.props.onAuthSuccess(response.headers["x-auth-token"]);
                setTimeout(() => {
                    this.props.onAuthLogout();
                }, 3600000);
            })
            .catch((err) => {
                this.props.onAuthFail(err.response.data);
            });
    };

    render() {
        const registerFields = Object.keys(this.state.inputFields).map(
            (inputId) => {
                const field = this.state.inputFields[inputId];
                if (inputId === "dob" || inputId === "gender") {
                    return (
                        <label key={inputId}>
                            {field.label}
                            <Input
                                key={field.label}
                                config={field.config}
                                value={field.value}
                                isValid={field.isValid}
                                isTouched={field.isTouched}
                                onChangeHandler={(event) => {
                                    this.onChangeHandler(event, inputId);
                                }}
                            />
                        </label>
                    );
                }
                return (
                    <Input
                        key={field.label}
                        config={field.config}
                        value={field.value}
                        isValid={field.isValid}
                        isTouched={field.isTouched}
                        onChangeHandler={(event) => {
                            this.onChangeHandler(event, inputId);
                        }}
                    />
                );
            }
        );

        let alert = null;
        if (this.state.alert) {
            alert = (
                <Alert type={this.state.alert.type}>
                    {this.state.alert.message}
                </Alert>
            );
        }

        const otpInputDetails = this.state.modalFields.otp;
        const otpInput = (
            <Input
                config={otpInputDetails.config}
                value={otpInputDetails.value}
                onChangeHandler={(event) => {
                    this.onModalChangeHandler(event, "otp");
                }}
                isValid={otpInputDetails.isValid}
                isTouched={otpInputDetails.isTouched}
            />
        );

        let modal = null;
        if (this.state.showOTPModal) {
            modal = (
                <Modal
                    title="OTP"
                    onClose={this.onCloseOTPModal}
                    onDismiss={this.onCloseOTPModal}
                    onProceed={this.onOTPSubmitHandler}
                    disableProceed={!this.state.modalFields.otp.isValid}
                >
                    <div>
                        {this.props.error && (
                            <Alert type="failure">{this.props.error}</Alert>
                        )}
                        <p>A 6-Digit OTP Has Been Sent To Your Phone No.</p>
                        {otpInput}
                    </div>
                </Modal>
            );
        }

        return (
            <div className={classes.Register}>
                {this.props.loading || this.state.loading ? (
                    <Spinner size="10" />
                ) : null}
                {modal}
                <Container>
                    <h1 className={classes.RegisterHeader}>
                        Create New Account
                    </h1>

                    {alert}

                    {registerFields}

                    <Button
                        type="primary"
                        disabled={!this.state.proceed}
                        block
                        onClickHandler={this.onSubmitHandler}
                    >
                        Sign Up
                    </Button>

                    <Link className={classes.LoginLink} to="/">
                        Already have a account ?
                    </Link>
                </Container>
                <View
                    style={{
                        paddingTop: "10rem",
                        height: "20rem",
                    }}
                    path={viewImgSrc}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(Register);
