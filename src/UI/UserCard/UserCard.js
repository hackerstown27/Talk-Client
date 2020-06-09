import React from "react";
import classes from "./UserCard.module.css";
import Avatar from "../Avatar/Avatar";
import Button from "../Button/Button";
import { capitalize, toPhoneFormat } from "../../utility";

const UserCard = (props) => {
    let options = [];
    let classList = [classes.UserCard];
    if (props.type === "friend") {
        options = [
            {
                name: "Message",
                type: "primary",
                action: props.primaryAction,
            },
            {
                name: "Unfriend",
                type: "secondary",
                action: props.secondaryAction,
            },
        ];
    } else if (props.type === "personUnRequested") {
        options = [
            {
                name: "Send Request",
                type: "primary",
                action: props.primaryAction,
            },
        ];
    } else if (props.type === "personRequested") {
        options = [
            {
                name: "Cancel Request",
                type: "secondary",
                action: props.secondaryAction,
            },
        ];
    } else if (props.type === "request") {
        options = [
            {
                name: "Accept",
                type: "primary",
                action: props.primaryAction,
            },
            {
                name: "Decline",
                type: "secondary",
                action: props.secondaryAction,
            },
        ];
    } else if (props.type === "inbox") {
        classList.push(classes.Inbox);
    }

    if (props.selected) {
        classList.push(classes.Selected);
    }

    return (
        <div className={classList.join(" ")} onClick={props.onClickHandler}>
            <Avatar
                size="4"
                src={`http://localhost:5000/api/users/uploads/${props.data.profilePic.filename}`}
            />
            <div className={classes.Info}>
                <p className={classes.Name}>{capitalize(props.data.name)}</p>
                <p className={classes.Phone}>
                    {toPhoneFormat(props.data.phoneNo)}
                </p>
            </div>
            <div className={classes.Options}>
                {options.map((option, index) => {
                    return (
                        <Button
                            key={index}
                            type={option.type}
                            onClickHandler={option.action}
                            block
                            xs
                        >
                            {option.name}
                        </Button>
                    );
                })}
                {props.label}
            </div>
        </div>
    );
};

export default UserCard;
