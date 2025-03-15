import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {StorageService} from "../../../shared/services/storage/storage.service";

export interface AdminRentalInfoDto {
  rentalPositionId: number;
  rentalStart: string;
  rentalEnd: string;
  positionPrice: number;
  userEmail: string;
  userId: number;
  articleDesignation: string;
  articleInstanceInventoryNumber: string;
}


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/rental';
  constructor(private http: HttpClient) { }

  getCurrentRentals(): Observable<AdminRentalInfoDto[]> {
    return this.http.get<AdminRentalInfoDto[]>(`${this.apiUrl}/admin/current`);
  }

  getDueRentals(): Observable<AdminRentalInfoDto[]> {
    return this.http.get<AdminRentalInfoDto[]>(`${this.apiUrl}/admin/due`);
  }

  getUpcomingUnderRepairRentals(): Observable<AdminRentalInfoDto[]> {
    return this.http.get<AdminRentalInfoDto[]>(`${this.apiUrl}/admin/upcoming-under-repair`);
  }

  createAuthHeader(): HttpHeaders {
    let authHeaders: HttpHeaders = new HttpHeaders();
    return authHeaders.set(
        'Authorization',
        'Bearer ' + StorageService.getToken()
    )
  }
}
