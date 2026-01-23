export interface LikedBooksState { 
    likedBookIds: number[]; 
    loading: boolean; 
    error: any; 
} 

export const initialState: LikedBooksState = { 
    likedBookIds: [], 
    loading: false, 
    error: null
}