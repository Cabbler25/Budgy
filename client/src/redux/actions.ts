// Action types, i.e what action is to be done
export const userActionTypes = {
    UPDATE_USER_SESSION: 'UPDATE_USER_SESSION'
}

// Our actions will automatically dispatch to the reducers
// Define what data we are sharing
export const updateUserSession = (val: boolean) => (dispatch: any) => {
    dispatch({
        type: userActionTypes.UPDATE_USER_SESSION,
        loggedIn: val
    })
}