import { catchError, map, of, switchMap } from "rxjs";
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { LikedBookService } from "../../services/liked-books.service.js";
import * as LikedBooksActions from './liked-books.actions.js';

@Injectable()
export class LikedBooksEffects {

    private actions$ = inject(Actions)
    private likedBooksService = inject(LikedBookService)

    loadLikedBooks$ = createEffect(() =>
        this.actions$.pipe(
            ofType(LikedBooksActions.loadLikedBooks),
            switchMap(({ userId }) =>
                this.likedBooksService.getLikedBookIds(userId).pipe(
                    map(bookIds => LikedBooksActions.loadLikedBooksSuccess({ bookIds })),
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
                    map(response => LikedBooksActions.toggleLikeSuccess({ bookId: response.bookId, isLiked: response.liked })),
                    catchError(error => of(LikedBooksActions.toggleLikeFailure({ error })))
                )
            )
        )
    );
}

