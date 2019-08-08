// Action types, i.e what action is to be done
export const userActionTypes = {
    UPDATE_USER_LOGGED_IN: 'UPDATE_USER_LOGGED_IN'
}

export const uiActionTypes = {
    SET_MOBILE_VIEW: 'SET_MOBILE_VIEW'
}

// Our actions will automatically dispatch to the reducers.
// Define what data we are sharing.
export const updateUserLoggedIn = (val: boolean) => (dispatch: any) => {
    dispatch({
        type: userActionTypes.UPDATE_USER_LOGGED_IN,
        isLoggedIn: val
    })
}

export const setMobileView = (val: boolean) => (dispatch: any) => {
    dispatch({
        type: uiActionTypes.SET_MOBILE_VIEW,
        isMobileView: val
    })
}