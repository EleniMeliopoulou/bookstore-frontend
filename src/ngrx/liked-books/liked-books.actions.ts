import { createAction, props } from '@ngrx/store';

export const loadLikedBooks = createAction(
  '[Liked Books] Load Liked Books',
  props<{ userId: number }>()
);

export const loadLikedBooksSuccess = createAction(
  '[Liked Books] Load Liked Books Success',
  props<{ bookIds: number[] }>()
);

export const loadLikedBooksFailure = createAction(
  '[Liked Books] Load Liked Books Failure',
  props<{ error: any }>()
);

export const toggleLike = createAction(
  '[Liked Books] Toggle Like',
  props<{ userId: number; bookId: number }>()
);

export const toggleLikeSuccess = createAction(
  '[Liked Books] Toggle Like Success',
  props<{ bookId: number; isLiked: boolean }>()
);

export const toggleLikeFailure = createAction(
  '[Liked Books] Toggle Like Failure',
  props<{ error: any }>()
);