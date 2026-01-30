import { createFeatureSelector, createSelector } from "@ngrx/store";
import { LikedBooksState } from "./liked-books.state.js";

export const selectLikedBooksState = createFeatureSelector<LikedBooksState>('likedBooks');

export const selectLikedBooks = createSelector(
    selectLikedBooksState,
    state => state.likedBooks
);

export const selectIsBookLiked = (bookId: number) => createSelector(
    selectLikedBooksState, state => state.likedBooks.some(b => b.id === bookId)
);

export const selectLoading = createSelector(
    selectLikedBooksState,
    state => state.loading
);

export const selectError = createSelector(
    selectLikedBooksState,
    state => state.error
);