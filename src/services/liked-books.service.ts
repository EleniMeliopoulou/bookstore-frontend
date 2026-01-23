import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { Books, LikeResponse } from "../interfaces/interfaces.js";

@Injectable({
    providedIn: 'root'
})
export class LikedBookService {
    private apiUrl = 'http://localhost:8080';

    private http = inject(HttpClient)

    getLikedBooks(userId: number): Observable<Books[]> {
        const params = new HttpParams().set('userId', userId.toString())
        return this.http.get<Books[]>(`${this.apiUrl}/liked-books`, { params });
    }

    getLikedBookIds(userId: number): Observable<number[]> {
        return this.http.get<number[]>(`${this.apiUrl}/liked-book-ids`, {
            params: { userId }
        });
    }

    toggleLike(userId: number, bookId: number): Observable<LikeResponse> {
        return this.http.post<LikeResponse>(`${this.apiUrl}/toggle-like`, null, {
            params: { userId, bookId }
        });
    }
}