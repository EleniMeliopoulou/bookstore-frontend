import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { Books } from "../interfaces/interfaces.js";

@Injectable({
    providedIn: 'root'
})
export class BookService {
    private apiUrl = 'http://localhost:8080/getallbooks';

    private http = inject(HttpClient)

    getBooks(): Observable<Books[]> {
        return this.http.get<Books[]>(this.apiUrl);
    }

    searchBook(title: string): Observable<Books[]> {
        return this.http.get<Books[]>(`http://localhost:8080/searchbook/${title}`);
    }
}