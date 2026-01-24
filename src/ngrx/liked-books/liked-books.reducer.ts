import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as LikedBooksActions from './liked-books.actions.js';
import { LikedBooksState, initialState } from './liked-books.state.js';
import { logout } from './liked-books.actions.js';

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

export const likedBooksReducer = createReducer(
    initialState,
    on(LikedBooksActions.loadLikedBooks,
        state => ({
            ...state,
            loading: true
        })),
    on(LikedBooksActions.loadLikedBooksSuccess, (state, { books }) => {
        console.log('Reducer received books:', books);
        return {
            ...state,
            loading: false,
            likedBooks: books,
            error: null
        };
    }),
    on(LikedBooksActions.loadLikedBooksFailure, (state, { error }) =>
    ({
        ...state,
        loading: false,
        error
    })),
    on(LikedBooksActions.toggleLike, state =>
    ({
        ...state,
        loading: true
    })),
    on(LikedBooksActions.toggleLikeSuccess, (state, { book, isLiked }) => {
        if (!book || !book.id) {
            console.error('Invalid book received:', book);
            return state;
        }
        return {
            ...state,
            loading: false,
            likedBooks: isLiked
                ? [...state.likedBooks, book]
                : state.likedBooks.filter(b => b.id !== book.id)
        };
    }),
    on(LikedBooksActions.toggleLikeFailure, (state, { error }) =>
    ({
        ...state,
        loading: false,
        error
    })),
    on(logout, () => initialState)
);