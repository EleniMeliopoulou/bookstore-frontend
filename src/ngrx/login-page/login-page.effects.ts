import { catchError, map, mergeMap, of } from "rxjs";
import { UserService } from "../../services/user.service.js";
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as LoginActions from './login-page.actions.js';
import * as LikedBooksActions from '../liked-books/liked-books.actions.js';

@Injectable()
export class LoginPageEffects {

    private actions$ = inject(Actions)
    private userService = inject(UserService)

    login$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoginActions.login),
            mergeMap(({ email, password }) =>
                this.userService.login(email, password).pipe(
                    map(user => LoginActions.loginSuccess({ user })),
                    catchError(error => of(LoginActions.loginFailure({ error })))
                )
            )
        )
    );

    loadLikedBooksOnLogin$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoginActions.loginSuccess),
            map(({ user }) => LikedBooksActions.loadLikedBooks({ userId: user.id! }))
        )
    );

    updateUsername$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LoginActions.updateUsername),
            mergeMap(({ email, username }) =>
                this.userService.updateUser(email, username).pipe(
                    mergeMap(() =>
                        this.userService.getUser(email).pipe(
                            map(user => LoginActions.updateUsernameSuccess({ user })),
                            catchError(error => of(LoginActions.updateUsernameFailure({ error })))
                        )
                    ),
                    catchError(error => of(LoginActions.updateUsernameFailure({ error })))
                )
            )
        )
    );
}


