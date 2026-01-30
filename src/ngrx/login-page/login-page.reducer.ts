import { createReducer, createSelector, on } from "@ngrx/store";
import { loginSuccess, logout, updateUsernameSuccess } from "./login-page.actions.js";
import { UserProfile } from "../../interfaces/interfaces.js";
import { AppState } from "../app.state.js";

export interface LoginState {
    user: UserProfile | null;
    loggedIn: boolean;
}

export const initialState: LoginState = {
    user: null,
    loggedIn: false
};

export const selectLoginState = (state: AppState) => state.auth;

export const selectUser = createSelector(
    selectLoginState,
    (state: LoginState) => state.user
);

export const selectUsername = createSelector(selectUser, (user) => user?.username);

export const selectUserId = createSelector(
    selectUser,
    (user) => user?.id
);

export const loginReducer = createReducer(
    initialState,
    on(loginSuccess, (state, { user }) => {
        console.log('Reducer loginSuccess:', user);
        return { ...state, user, loggedIn: true };
    }),
    on(updateUsernameSuccess, (state, { user }) =>
        ({ ...state, user })),
    on(logout, () => initialState)
);

