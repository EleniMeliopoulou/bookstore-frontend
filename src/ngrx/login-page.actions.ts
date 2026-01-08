import { createAction, props } from '@ngrx/store';
import { UserProfile } from '../interfaces/interfaces.js';

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