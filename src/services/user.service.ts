import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError } from "rxjs";
import { UserProfile } from "../interfaces/interfaces.js";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:8080/getuserbyemail';
    private http = inject(HttpClient)

    getUser(email: string): Observable<UserProfile> {
        return this.http.get<UserProfile>(`${this.apiUrl}?email=${email}`).pipe(
            catchError((error) => {
                throw error.message;
            })
        );
    }

    createUser(newUser: UserProfile): Observable<UserProfile> {
        return this.http.post<UserProfile>(`http://localhost:8080/createuser`,newUser).pipe(
            catchError((error) => {
                throw error.message;
            })
        );
    }
}