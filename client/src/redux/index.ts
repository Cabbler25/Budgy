import { combineReducers } from "redux";
import { updateUserSessionReducer } from "./user.reducer";

// Interfaces for every state we want to use
export interface IUserState {
    loggedIn: boolean,
}

// Interface for combination of every previous state
export interface IState {
    user: IUserState,
}

// Combine all reducers into one
export const state = combineReducers<IState>({
    user: updateUserSessionReducer,
})