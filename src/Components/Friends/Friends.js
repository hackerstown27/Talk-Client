import React from "react";

import classes from "./Friends.module.css";
import Options from "./Options/Options";
import { Route, Switch } from "react-router";
import View from "../../UI/View/View";
import viewImgSrc from "../../assets/icons/friendsicon.svg";
import ViewFriends from "./ViewFriends/ViewFriends";
import FindFriends from "./FindFriends/FindFriends";
import Requests from "./Requests/Requests";

const Friends = (props) => {
    return (
        <div className={classes.Friends}>
            <Options />
            <Switch>
                <Route path="/dashboard/friends" exact>
                    <View
                        style={{
                            height: "30rem",
                        }}
                        path={viewImgSrc}
                    />
                </Route>
                <Route path="/dashboard/friends/show" exact>
                    <ViewFriends />
                </Route>
                <Route path="/dashboard/friends/find" exact>
                    <FindFriends />
                </Route>
                <Route path="/dashboard/friends/requests" exact>
                    <Requests />
                </Route>
            </Switch>
        </div>
    );
};

export default Friends;
