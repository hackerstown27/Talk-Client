import React from "react";

import classes from "./Options.module.css";
import showFriendsIcon from "../../../assets/icons/showfriendsicon.svg";
import addFriendsIcon from "../../../assets/icons/addfriendsicon.svg";
import requestIcon from "../../../assets/icons/requesticon.svg";
import { withRouter } from "react-router";

const Options = (props) => {
    const options = [
        {
            icon: showFriendsIcon,
            label: "View Friends",
            path: "/dashboard/friends/show",
        },
        {
            icon: addFriendsIcon,
            label: "Add Friends",
            path: "/dashboard/friends/find",
        },
        {
            icon: requestIcon,
            label: "Requests",
            path: "/dashboard/friends/requests",
        },
    ];
    return (
        <div>
            <ul className={classes.Options}>
                {options.map((details) => (
                    <li key={details.label} onClick={() => props.history.push(details.path)}>
                        <img
                            className={classes.Icon}
                            src={details.icon}
                            alt=""
                        />
                        <span className={classes.Option}>{details.label}</span>
                        <span className={classes.Arrow}></span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default withRouter(Options);
