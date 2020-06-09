import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { connect } from "react-redux";

import Login from "./Container/Login/Login";
import Register from "./Container/Register/Register";
import Dashboard from "./Container/Dashboard/Dashboard";
import * as actions from "./store/actions/auth";
import ForgetPassword from "./Container/ForgetPassword/ForgetPassword";

class App extends React.Component {
    UNSAFE_componentWillMount = () => {
        this.props.onAuthAuto();
    };

    render() {
        const routes = [
            <Route key="login" path="/" exact component={Login} />,
            <Route key="register" path="/sign-up" exact component={Register} />,
            <Route
                key="forgetPassword"
                path="/forget-password"
                exact
                component={ForgetPassword}
            />,
        ];

        if (this.props.authToken) {
            routes.push(
                <Route
                    key="dashboard"
                    path="/dashboard"
                    component={Dashboard}
                />
            );
        }

        return (
            <BrowserRouter>
                <Switch>
                    {routes}
                    <Route path="*" exact render={() => <Redirect to="/" />} />,
                </Switch>
            </BrowserRouter>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authToken: state.auth.authToken,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onAuthAuto: () => dispatch(actions.onAuthAuto()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
