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
  userFirstName: string;
  userLastName:string;
  articleDesignation: string;
  articleInstanceInventoryNumber: string;
  status: string;

  newRentalStart?: string;
  newRentalEnd?: string;
}


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private rentalApiUrl = 'http://localhost:8080/api/rental';
  constructor(private http: HttpClient) { }

  getCurrentRentals(): Observable<AdminRentalInfoDto[]> {
    return this.http.get<AdminRentalInfoDto[]>(`${this.rentalApiUrl}/admin/current`);
  }

  getDueRentals(): Observable<AdminRentalInfoDto[]> {
    return this.http.get<AdminRentalInfoDto[]>(`${this.rentalApiUrl}/admin/due`);
  }

  getOverDueRentals(): Observable<AdminRentalInfoDto[]> {
    return this.http.get<AdminRentalInfoDto[]>(`${this.rentalApiUrl}/admin/over-due`);
  }

  updateRentalPeriod(rentalPositionId: number, rentalEnd: string): Observable<AdminRentalInfoDto> {
    return this.http.patch<AdminRentalInfoDto>(
        `${this.rentalApiUrl}/admin/update-rental/${rentalPositionId}`,
        { rentalEnd }
    );
  }

  getAllRentalPositions(): Observable<AdminRentalInfoDto[]> {
    return this.http.get<AdminRentalInfoDto[]>(`${this.rentalApiUrl}/admin/rental/all-positions`);
  }



  createAuthHeader(): HttpHeaders {
    let authHeaders: HttpHeaders = new HttpHeaders();
    return authHeaders.set(
        'Authorization',
        'Bearer ' + StorageService.getToken()
    )
  }

  formatToLocalDate(dateInput: string | Date): string {
    const date = (dateInput instanceof Date) ? dateInput : new Date(dateInput);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  updateInstanceStatus(rentalPositionId: number, newStatus: string): Observable<AdminRentalInfoDto> {
    return this.http.patch<AdminRentalInfoDto>(
        `${this.rentalApiUrl}/admin/update-instance-status/${rentalPositionId}`,
        { newStatus }
    );
  }

  getUnderRepairInstances(): Observable<AdminRentalInfoDto[]> {
    return this.http.get<AdminRentalInfoDto[]>(`${this.rentalApiUrl}/admin/under-repair`);
  }


  updateInstanceStatusByInventoryNo(articleInstanceInventoryNumber: string, newStatus: string) {
    return this.http.patch<AdminRentalInfoDto>(
        `${this.rentalApiUrl}/admin/update-instance-status-by-inventory/${articleInstanceInventoryNumber}`,
        { newStatus }
    );
  }
}
