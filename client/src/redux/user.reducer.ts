import { userActionTypes } from './actions';

const initialState = {
    loggedIn: false,
};

// Define what actually happens when a specific action is dispatched
// Reducers must be pure functions, therefore do not alter
// state directly within them. Construct and return a new state
export const updateUserSessionReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case userActionTypes.UPDATE_USER_SESSION:
            return {
                ...state,
                loggedIn: action.loggedIn
            }
        default: break;
    }
    return state;
}