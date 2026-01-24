export interface Books {
    id?: number;
    author?: string;
    description?: string;
    genre?: string;
    image?: string;
    publishedDate?: string;
    rating?: number;
    title?: string;
    userId?: number;
    isLiked?: boolean;
}

export interface UserProfile { 
    id?: number; 
    username?: string; 
    email?: string; 
    titles?: string[]; 
}

export interface LikeResponse{
    book: Books;
    liked: boolean;
}