import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {StorageService} from "../storage/storage.service";

@Injectable({
    providedIn: 'root'
})
export class RentalService {
    private apiUrl = 'http://localhost:8080/api';
    constructor(private http: HttpClient) { }

    createRental(rental: any): Observable<any> {
        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + StorageService.getToken(),
            'Content-Type': 'application/json'
        });

        return this.http.post<any>(`${this.apiUrl}/rental`, rental, { headers });
    }


    createAuthHeader(): HttpHeaders {
        let authHeaders: HttpHeaders = new HttpHeaders();
        return authHeaders.set(
            'Authorization',
            'Bearer ' + StorageService.getToken()
        )
    }
}