import { Books } from "../../interfaces/interfaces.js";

export interface LikedBooksState {
    likedBooks: Books[];
    loading: boolean;
    error: any;
}

export const initialState: LikedBooksState = {
    likedBooks: [],
    loading: false,
    error: null
}