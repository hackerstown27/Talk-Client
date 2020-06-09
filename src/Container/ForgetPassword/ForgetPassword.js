import React from "react";
import classes from "./ForgetPassword.module.css";
import Container from "../../UI/Container/Container";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";
import { Link } from "react-router-dom";
import { checkValidation } from "../../utility";
import View from "../../UI/View/View";
import viewImgSrc from "../../assets/icons/forgetpassword.svg";
import axios from "../../axios-instances/axios";
import Alert from "../../UI/Alert/Alert";
import Spinner from "../../UI/Spinner/Spinner";
import Modal from "../../UI/Modal/Modal";

class ForgetPassword extends React.Component {
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
        alert: null,
        modalAlert: null,
        proceed: false,
        loading: false,
        showModal: false,
    };

    onSendOTPHandler = () => {
        this.setState({ loading: true });
        axios
            .post("/auth/forgetPassword", {
                phoneNo: this.state.inputFields.phoneNo.value,
            })
            .then((response) => {
                this.setState({
                    loading: false,
                    showModal: true,
                    alert: null,
                });
            })
            .catch((error) => {
                this.setState({
                    alert: {
                        type: "failure",
                        message: error.response.data,
                    },
                    loading: false,
                });
            });
    };

    onSubmitOTPHandler = () => {
        const inputFields = this.state.inputFields;
        this.setState({ loading: true });
        axios
            .post("/auth/forgetPassword/verify", {
                phoneNo: inputFields.phoneNo.value,
                otp: inputFields.otp.value,
            })
            .then((response) => {
                this.setState({
                    alert: {
                        type: "success",
                        message: response.data,
                    },
                });
                this.onCloseOTPModal();
            })
            .catch((error) => {
                this.setState({
                    modalAlert: {
                        type: "failure",
                        message: error.response.data,
                    },
                });
            })
            .finally(() => {
                this.setState({
                    loading: false,
                });
            });
    };

    resetOTPState = () => {
        const inputFields = {
            ...this.state.inputFields,
            otp: {
                ...this.state.inputFields.otp,
                isValid: false,
                isTouched: false,
                value: "",
            },
        };
        this.setState({ inputFields: inputFields });
    };

    onChangeHandler = (event, inputId) => {
        this.setState(checkValidation(event, inputId, this.state.inputFields));
    };

    onCloseOTPModal = () => {
        this.setState({ showModal: false, modalAlert: null });
        this.resetOTPState();
    };

    render() {
        const phoneInputDetails = this.state.inputFields.phoneNo;
        const phoneInput = (
            <Input
                config={phoneInputDetails.config}
                key={phoneInputDetails.label}
                value={phoneInputDetails.value}
                onChangeHandler={(event) => {
                    this.onChangeHandler(event, "phoneNo");
                }}
                isValid={phoneInputDetails.isValid}
                isTouched={phoneInputDetails.isTouched}
            />
        );

        const otpInputDetails = this.state.inputFields.otp;
        const otpInput = (
            <Input
                config={otpInputDetails.config}
                value={otpInputDetails.value}
                onChangeHandler={(event) => {
                    this.onChangeHandler(event, "otp");
                }}
                isValid={otpInputDetails.isValid}
                isTouched={otpInputDetails.isTouched}
            />
        );

        return (
            <React.Fragment>
                {this.state.loading && <Spinner size="10" />}
                {this.state.showModal && (
                    <Modal
                        title="OTP"
                        onClose={this.onCloseOTPModal}
                        onDismiss={this.onCloseOTPModal}
                        onProceed={this.onSubmitOTPHandler}
                        disableProceed={!this.state.inputFields.otp.isValid}
                    >
                        <div>
                            {this.state.modalAlert && (
                                <Alert type={this.state.modalAlert.type}>
                                    {this.state.modalAlert.message}
                                </Alert>
                            )}
                            <p>A 6-Digit OTP Has Been Sent To Your Phone No.</p>
                            {otpInput}
                        </div>
                    </Modal>
                )}
                <div className={classes.ForgetPassword}>
                    <Container>
                        <h1 className={classes.Header}>
                            Recover Your Account...
                        </h1>

                        {this.state.alert && (
                            <Alert type={this.state.alert.type}>
                                {this.state.alert.message}
                            </Alert>
                        )}

                        <View
                            style={{
                                height: "7rem",
                            }}
                            path={viewImgSrc}
                        />

                        {phoneInput}

                        <Button
                            type="primary"
                            disabled={!this.state.inputFields.phoneNo.isValid}
                            onClickHandler={this.onSendOTPHandler}
                            block
                        >
                            Send OTP
                        </Button>

                        <Link className={classes.Link} to="/">
                            Want to go back to the login ?
                        </Link>
                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

export default ForgetPassword;
