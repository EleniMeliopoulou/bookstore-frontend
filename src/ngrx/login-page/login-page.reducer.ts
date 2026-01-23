import { createReducer, createSelector, on } from "@ngrx/store";
import { loginSuccess, logout, updateUsernameSuccess } from "./login-page.actions.js";
import { UserProfile } from "../../interfaces/interfaces.js";
import { AppState } from "../app.state.js";

export interface AuthState {
    user: UserProfile | null;
    loggedIn: boolean;
}

export const initialState: AuthState = {
    user: null,
    loggedIn: false
};

export const selectAuthState = (state: AppState) => state.auth;

export const selectUser = createSelector(
    selectAuthState,
    (state: AuthState) => state.user
);

export const selectUsername = createSelector(selectUser, (user) => user?.username);

export const authReducer = createReducer(
    initialState,
    on(loginSuccess, (state, { user }) => { 
        console.log('Reducer loginSuccess:', user); 
        return { ...state, user, loggedIn: true }; 
    }),
    on(updateUsernameSuccess, (state, { user }) => 
        ({ ...state, user })),
    on(logout, () => initialState)
);

