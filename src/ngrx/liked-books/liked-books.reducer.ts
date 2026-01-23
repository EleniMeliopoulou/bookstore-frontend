import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import * as LikedBooksActions from './liked-books.actions.js';
import { LikedBooksState, initialState } from './liked-books.state.js';

export const selectLikedBooksState = createFeatureSelector<LikedBooksState>('likedBooks');

export const selectLikedBookIds = createSelector(
    selectLikedBooksState,
    state => state.likedBookIds
);

export const selectIsBookLiked = (bookId: number) => createSelector(
    selectLikedBooksState,
    state => state.likedBookIds.includes(bookId)
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
    on(LikedBooksActions.loadLikedBooksSuccess, (state, { bookIds }) =>
    ({
        ...state,
        loading: false,
        likedBookIds: bookIds,
        error: null
    })),
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
    on(LikedBooksActions.toggleLikeSuccess, (state, { bookId, isLiked }) => {
        console.log("REDUCER FIRED", bookId, isLiked);
        return {
            ...state,
            loading: false,
            likedBookIds: isLiked
                ? [...state.likedBookIds, bookId]
                : state.likedBookIds.filter(id => id !== bookId)
        };
    }),
    on(LikedBooksActions.toggleLikeFailure, (state, { error }) =>
    ({
        ...state,
        loading: false,
        error
    }))
);