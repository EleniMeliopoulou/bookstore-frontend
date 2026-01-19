import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { UserProfile } from "../interfaces/interfaces.js";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:8080/getuserbyemail';
    private http = inject(HttpClient)

    login(email: string, password: string) {
        return this.http.post<{ email: string }>('http://localhost:8080/login',
            { email, password });
    }

    changePassword(email: string, password: string) {
        return this.http.post<{ email: string, password: string }>('http://localhost:8080/changepassword',
            { email, password });
    }

    getUser(email: string): Observable<UserProfile> {
        return this.http.get<UserProfile>(`${this.apiUrl}?email=${email}`).pipe(
            catchError((error) => { return throwError(() => error); })
        );
    }

    createUser(newUser: UserProfile): Observable<UserProfile> {
        return this.http.post<UserProfile>(`http://localhost:8080/createuser`, newUser).pipe(
            catchError((error) => {
                throw error.message;
            })
        );
    }

    updateUser(email: string, username: string) {
        return this.http.put<{ email: string, username: string }>('http://localhost:8080/updateuser',
            { email, username }).pipe( catchError(err => throwError(() => err)));
    }
}