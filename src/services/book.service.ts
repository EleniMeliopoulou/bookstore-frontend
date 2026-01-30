import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { Books } from "../interfaces/interfaces.js";

@Injectable({
    providedIn: 'root'
})
export class BookService {
    private apiUrl = 'http://localhost:8080';

    private http = inject(HttpClient);

    getBooks(): Observable<Books[]> {
        return this.http.get<Books[]>(`${this.apiUrl}/getallbooks`);
    }

    searchBooks(title: string) {
        return this.http.get<Books[]>(`${this.apiUrl}/searchbook/${title}`);
    }

    getBook(id: number): Observable<Books> {
        return this.http.get<Books>(`${this.apiUrl}/getbook`, {
            params: { id }
        })
    }
}