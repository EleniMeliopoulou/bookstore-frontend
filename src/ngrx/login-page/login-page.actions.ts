import { createAction, props } from '@ngrx/store';
import { UserProfile } from '../../interfaces/interfaces.js';

export const login = createAction(
  '[Login Page] Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth API] Login Success',
  props<{ user: UserProfile }>()
);

export const loginFailure = createAction(
  '[Auth API] Login Failure',
  props<{ error: any }>()
);

export const logout = createAction('[Auth] Logout');

export const updateUsername = createAction(
  '[Profile Modal] Update User',
  props<{ email: string; username: string }>()
);

export const updateUsernameSuccess = createAction(
  '[User API] Update Username Success',
  props<{ user: UserProfile }>()
);

export const updateUsernameFailure = createAction(
  '[User API] Update Username Failure',
  props<{ error: any }>()
);