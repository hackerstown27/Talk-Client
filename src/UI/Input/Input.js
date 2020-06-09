import React from "react";

import classes from "./Input.module.css";

const Input = (props) => {
    let classList = [classes.Input];
    if (!props.isValid && props.isTouched) {
        classList.push(classes.InValid);
    } else {
        classList.push(classes.Valid);
    }
    classList = classList.join(" ");
    switch (props.config.type) {
        case "phoneNo":
            return (
                <div className={classes.PhoneInput}>
                    <div id={classes.PhonePreffix}>+91</div>
                    <div>
                        <input
                            id={classes.PhoneSuffix}
                            className={classList}
                            type="number"
                            placeholder={props.config.placeholder}
                            value={props.value}
                            onChange={props.onChangeHandler}
                            autoComplete="no"
                        />
                    </div>
                </div>
            );
        case "password":
            return (
                <input
                    className={classList}
                    type="password"
                    placeholder={props.config.placeholder}
                    value={props.value}
                    onChange={props.onChangeHandler}
                    autoComplete="no"
                />
            );
        case "text":
            return (
                <input
                    className={classList}
                    type="text"
                    placeholder={props.config.placeholder}
                    value={props.value}
                    onChange={props.onChangeHandler}
                    autoComplete="no"
                />
            );
        case "otp":
            return (
                <input
                    id={classes.OTP}
                    className={classList}
                    placeholder={props.config.placeholder}
                    type="number"
                    value={props.value}
                    onChange={props.onChangeHandler}
                    autoComplete="no"
                />
            );
        case "date":
            return (
                <input
                    className={classList}
                    type="date"
                    placeholder={props.config.placeholder}
                    value={props.value}
                    onChange={props.onChangeHandler}
                    autoComplete="no"
                />
            );
        case "select":
            return (
                <select
                    id={classes.Dropdown}
                    className={classList}
                    value={props.value}
                    onChange={props.onChangeHandler}
                >
                    {props.config.options.map((opt) => {
                        return (
                            <option value={opt.value} key={opt.value}>
                                {opt.displayValue}
                            </option>
                        );
                    })}
                </select>
            );
        case "file":
            const fileId = classes.FileInput;
            return (
                <React.Fragment>
                    <input
                        type="file"
                        id={fileId}
                        onChange={props.onChangeHandler}
                        accept={props.acceptedTypes.join(", ")}
                    />
                    <label htmlFor={fileId}>{props.label}</label>
                </React.Fragment>
            );
        default:
            return null;
    }
};

export default Input;
