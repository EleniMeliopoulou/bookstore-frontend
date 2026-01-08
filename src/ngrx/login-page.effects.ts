import { catchError, map, mergeMap, of, tap } from "rxjs";
import { UserService } from "../services/user.service.js";
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { login, loginFailure, loginSuccess } from "./login-page.actions.js";


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
}

  
  