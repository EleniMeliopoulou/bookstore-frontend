import { catchError, map, mergeMap, of, tap } from "rxjs";
import { UserService } from "../services/user.service.js";
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { login, loginFailure, loginSuccess, updateUsername, updateUsernameFailure, updateUsernameSuccess } from "./login-page.actions.js";


@Injectable()
export class LoginPageEffects {

    private actions$ = inject(Actions)
    private authService = inject(UserService)

    login$ = createEffect(() =>
        this.actions$.pipe(
        ofType(login),
        mergeMap(({ email, password }) =>
            this.authService.login(email, password).pipe(
            mergeMap(() =>
                this.authService.getUser(email).pipe(
                map(user => loginSuccess({ user })),
                catchError(error => of(loginFailure({ error })))
                )
            ),
            catchError(error => of(loginFailure({ error })))
            )
        )
        )
    );

    updateUsername$ = createEffect(() =>
        this.actions$.pipe(
        ofType(updateUsername),
        mergeMap(({ email, username }) =>
            this.authService.updateUser(email, username).pipe(
            mergeMap(() =>
                this.authService.getUser(email).pipe(
                map(user => updateUsernameSuccess({ username })),
                catchError(error => of(updateUsernameFailure({ error })))
                )
            ),
            catchError(error => of(updateUsernameFailure({ error })))
            )
        )
        )
    );
}

  
  