import { userActionTypes } from '../actions';

const initialState = {
    isLoggedIn: false,
};

// Define what actually happens when a specific action is dispatched.
// Reducers must be pure functions, therefore do not alter
// state directly within them. Construct and return a new state.
export const updateUserReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case userActionTypes.UPDATE_USER_LOGGED_IN:
            return {
                ...state,
                isLoggedIn: action.isLoggedIn
            }
        default: return state;
    }
}