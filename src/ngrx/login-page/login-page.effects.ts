import { catchError, map, mergeMap, of, tap } from "rxjs";
import { UserService } from "../../services/user.service.js";
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
                    map(user => loginSuccess({ user })), // ✅ ενημερώνει το store με τον σωστό user 
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
                map(user => updateUsernameSuccess({ user })),
                catchError(error => of(updateUsernameFailure({ error })))
                )
            ),
            catchError(error => of(updateUsernameFailure({ error })))
            )
        )
        )
    );
}

  
  