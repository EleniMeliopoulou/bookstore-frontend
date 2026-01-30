import { createReducer, on } from '@ngrx/store';
import * as LikedBooksActions from './liked-books.actions.js';
import { initialState } from './liked-books.state.js';
import { logout } from './liked-books.actions.js';

export const likedBooksReducer = createReducer(
    initialState,
    on(LikedBooksActions.loadLikedBooks,
        state => ({
            ...state,
            loading: true
        })),
    on(LikedBooksActions.loadLikedBooksSuccess, (state, { books }) => {
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