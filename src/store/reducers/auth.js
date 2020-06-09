import * as actionTypes from "../actions/actionTypes";

const initialState = {
    authToken: null,
    tokenGenOn: null,
    error: null,
    loading: false,
    selectedUser: null,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ON_AUTH_START:
            return { ...state, loading: true };
        case actionTypes.ON_AUTH_SUCCESS:
            return {
                ...state,
                authToken: action.authToken,
                loading: false,
                error: null,
                tokenGenOn: action.tokenGenOn,
            };
        case actionTypes.ON_AUTH_FAIL:
            return { ...state, loading: false, error: action.error };
        case actionTypes.ON_AUTH_LOGOUT:
            return { ...initialState };
        case actionTypes.SET_SELECTED_USER:
            return { ...state, selectedUser: action.selectedUser };
        default:
    }
    return state;
};

export default reducer;
