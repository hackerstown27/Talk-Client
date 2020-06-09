import React from "react";

import NavBar from "../../Components/NavBar/NavBar";
import Auxilary from "../../HOC/Auxilary/Auxilary";
import { Route, Switch } from "react-router";
import ChangePassword from "../../Components/ChangePassword/ChangePassword";
import Logout from "../../Components/Logout/Logout";
import Chat from "../../Components/Chat/Chat";
import Friends from "../../Components/Friends/Friends";
import Profile from "../../Components/Profile/Profile";

class Dashboard extends React.Component {
    render() {
        return (
            <div>
                <Auxilary>
                    <NavBar />
                    <Switch>
                        <Route
                            path="/dashboard/"
                            exact
                            component={() => <Chat />}
                        />
                        <Route
                            path="/dashboard/profile"
                            exact
                            component={Profile}
                        />
                        <Route
                            path="/dashboard/friends"
                            component={() => <Friends />}
                        />
                        <Route
                            path="/dashboard/change-password"
                            exact
                            component={ChangePassword}
                        />
                        <Route
                            path="/dashboard/logout"
                            exact
                            component={() => <Logout />}
                        />
                    </Switch>
                </Auxilary>
            </div>
        );
    }
}

export default Dashboard;
