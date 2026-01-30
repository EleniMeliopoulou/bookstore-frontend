import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { UserProfile } from "../interfaces/interfaces.js";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = 'http://localhost:8080';
    private http = inject(HttpClient)

    login(email: string, password: string): Observable<UserProfile> {
        return this.http.post<UserProfile>(`${this.apiUrl}/login`,
            { email, password });
    }

    changePassword(email: string, password: string) {
        return this.http.post<{ email: string, password: string }>(`${this.apiUrl}/changepassword`,
            { email, password });
    }

    getUser(email: string): Observable<UserProfile> {
        return this.http.get<UserProfile>(`${this.apiUrl}/getuserbyemail`, {
            params: { email }
        })
    }

    createUser(newUser: UserProfile): Observable<UserProfile> {
        return this.http.post<UserProfile>(`${this.apiUrl}/createuser`, newUser)
    }

    updateUser(email: string, username: string) {
        return this.http.put<{ email: string, username: string }>(`${this.apiUrl}/updateuser`,
            { email, username })
    }
}