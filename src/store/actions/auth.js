import * as actionTypes from "../actions/actionTypes";

export const onAuthStart = () => {
    return { type: actionTypes.ON_AUTH_START };
};

export const onAuthSuccess = (authToken) => {
    const tokenGenOn = Date(Date.now());
    localStorage.setItem("authToken", authToken);
    localStorage.setItem("tokenGenOn", tokenGenOn);
    return {
        type: actionTypes.ON_AUTH_SUCCESS,
        authToken: authToken,
        tokenGenOn: tokenGenOn,
    };
};

export const onAuthFail = (error) => {
    return { type: actionTypes.ON_AUTH_FAIL, error: error };
};

export const onAuthAuto = () => {
    const authToken = localStorage.getItem("authToken");
    const tokenGenOn = localStorage.getItem("tokenGenOn");
    return {
        type: actionTypes.ON_AUTH_SUCCESS,
        authToken: authToken,
        tokenGenOn: tokenGenOn,
    };
};

export const onAuthLogout = () => {
    localStorage.clear();
    return { type: actionTypes.ON_AUTH_LOGOUT };
};

export const onSelectUserHandler = (user) => {
    return { type: actionTypes.SET_SELECTED_USER, selectedUser: user };
};
