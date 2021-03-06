import { combineReducers } from "redux";
import { updateUserReducer } from "./reducers/user.reducer";
import { updateUiReducer } from "./reducers/ui.reducer";

// Interfaces for every state we want to use
// Need more user data, add it here
export interface IUserState {
    isLoggedIn: boolean,
    id: number,
    first: string,
    last: string,
    username: string,
    email: '',
    token: string
}

export interface IUiState {
    isMobileView: boolean
}

// Interface for combination of every previous state
export interface IState {
    user: IUserState,
    ui: IUiState
}

// Combine all reducers into one
export const state = combineReducers<IState>({
    user: updateUserReducer,
    ui: updateUiReducer
})