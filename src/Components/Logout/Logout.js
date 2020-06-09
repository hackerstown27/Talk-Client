import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../../store/actions/auth";

class Logout extends React.Component {
    componentDidMount() {
        this.props.onLogoutHandler();
    }

    render() {
        return <Redirect to="/" />;
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLogoutHandler: () => dispatch(actions.onAuthLogout()),
    };
};

export default connect(null, mapDispatchToProps)(Logout);
