import React from "react";

import classes from "./Navbar.module.css";
import logo from "../../assets/icons/logo.svg";
import Menu from "../../UI/Menu/Menu";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import userProfileIcon from "../../assets/icons/userprofile.svg";
import friendsIcon from "../../assets/icons/friendsicon.svg";
import changePasswordIcon from "../../assets/icons/changepasswordicon.svg";
import logoutIcon from "../../assets/icons/logouticon.svg";
import axios from "../../axios-instances/axios";
import { capitalize } from "../../utility";

class NavBar extends React.Component {
    state = {
        profileData: null,
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
                });
            });
    }

    render() {
        const options = [
            {
                src: userProfileIcon,
                label: "Show User Profile",
                path: "/dashboard/profile",
            },
            { src: friendsIcon, label: "Friends", path: "/dashboard/friends" },
            {
                src: changePasswordIcon,
                label: "Change Password",
                path: "/dashboard/change-password",
            },
            { src: logoutIcon, label: "Logout", path: "/dashboard/logout" },
        ];
        return (
            <div>
                <ul className={classes.Navbar}>
                    <li
                        className={classes.Logo}
                        onClick={() => this.props.history.push("/")}
                    >
                        <img src={logo} alt="user pic" />
                        <span className={classes.NavBrand}>Talk</span>
                    </li>
                    <li className={classes.Menu}>
                        {this.state.profileData && (
                            <Menu
                                title={capitalize(this.state.profileData.name)}
                                menuIconSrc={`http://localhost:5000/api/users/uploads/${this.state.profileData.profilePic.filename}`}
                                options={options}
                            />
                        )}
                    </li>
                </ul>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ...state.auth,
    };
};

export default connect(mapStateToProps)(withRouter(NavBar));
