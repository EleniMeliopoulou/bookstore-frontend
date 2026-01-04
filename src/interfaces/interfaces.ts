export interface Books {
    id: number;
    author: string;
    borrowed: boolean;
    description?: string;
    genre?: string;
    image?: string;
    publishedDate: string;
    rating: number;
    title:string
    userId: number;
}

export interface UserProfile {
    id?: number;
    borrowedBookTitles?: string;
    email: string;
    password: string;
    username: string;
}