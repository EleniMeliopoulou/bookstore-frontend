import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { Books, LikeResponse } from "../interfaces/interfaces.js";

@Injectable({
    providedIn: 'root'
})
export class LikedBookService {
    private apiUrl = 'http://localhost:8080';

    private http = inject(HttpClient)

    getLikedBooks(userId: number): Observable<Books[]> {
        return this.http.get<Books[]>(`${this.apiUrl}/liked-books`, {
            params: { userId }
        });
    }

    toggleLike(userId: number, bookId: number): Observable<LikeResponse> {
        return this.http.post<LikeResponse>(`${this.apiUrl}/toggle-like`, null, {
            params: { userId, bookId }
        });
    }
}