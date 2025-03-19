import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {StorageService} from "../../../shared/services/storage/storage.service";
import {AdminRentalInfoDto} from "../../admin/service/admin.service";

export interface CustomerRentalInfoDto {
  rentalId: number;
  rentalPositionId: number;
  articleDesignation: string;
  inventoryNumber: string;
  rentalStart: string;
  rentalEnd: string;
  status: string;
  positionPrice: number;
  totalRentalPrice: number;
}



@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'http://localhost:8080/api/rental';
  constructor(private http: HttpClient) { }

  getAllRentalPositions(): Observable<CustomerRentalInfoDto[]> {
    return this.http.get<CustomerRentalInfoDto[]>(`${this.apiUrl}/my-positions`,
        {headers: this.createAuthHeader()});
  }

  createAuthHeader(): HttpHeaders {
    let authHeaders: HttpHeaders = new HttpHeaders();
    return authHeaders.set(
        'Authorization',
        'Bearer ' + StorageService.getToken()
    )
  }

  updateRentalPeriod(rentalPositionId: number, payload: any): Observable<CustomerRentalInfoDto> {
    return this.http.patch<CustomerRentalInfoDto>(
        `${this.apiUrl}/customer/update-rental/${rentalPositionId}`,
        payload,
        {headers: this.createAuthHeader()}
    );
  }

  formatToLocalDate(dateInput: string | Date): string {
    const date = (dateInput instanceof Date) ? dateInput : new Date(dateInput);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  deleteRentalPosition(rentalPositionId: number) {
    return this.http.delete<void>(
        `${this.apiUrl}/customer/delete-rental-position/${rentalPositionId}`,
        { headers: this.createAuthHeader() }
    );
  }
}
