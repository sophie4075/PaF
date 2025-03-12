import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {StorageService} from "../../../shared/services/storage/storage.service";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://localhost:8080/api/rental';
  constructor(private http: HttpClient) { }

  createRental(rental: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/rental`, rental);
  }


  createAuthHeader(): HttpHeaders {
    let authHeaders: HttpHeaders = new HttpHeaders();
    return authHeaders.set(
        'Authorization',
        'Bearer ' + StorageService.getToken()
    )
  }
}
