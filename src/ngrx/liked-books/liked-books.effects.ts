import { catchError, map, of, switchMap, tap } from "rxjs";
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { LikedBookService } from "../../services/liked-books.service.js";
import * as LikedBooksActions from './liked-books.actions.js';
import { LikeResponse } from "../../interfaces/interfaces.js";

@Injectable()
export class LikedBooksEffects {

    private actions$ = inject(Actions)
    private likedBooksService = inject(LikedBookService)

    loadLikedBooks$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LikedBooksActions.loadLikedBooks),
            switchMap(({ userId }) =>
                this.likedBooksService.getLikedBooks(userId).pipe(
                    map(books => LikedBooksActions.loadLikedBooksSuccess({ books })),
                    catchError(error => of(LikedBooksActions.loadLikedBooksFailure({ error })))
                )
            )
        )
    );

    toggleLike$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LikedBooksActions.toggleLike),
            switchMap(({ userId, bookId }) =>
                this.likedBooksService.toggleLike(userId, bookId).pipe(
                    tap(response => console.log("TOGGLE RESPONSE:", response)),
                    map((response: LikeResponse) => LikedBooksActions.toggleLikeSuccess({ book: response.book, isLiked: response.liked })),
                    catchError(error => of(LikedBooksActions.toggleLikeFailure({ error }))
                    )
                )
            )
        )
    );
}

