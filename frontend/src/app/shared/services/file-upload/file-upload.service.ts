import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {StorageService} from "../storage/storage.service";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private uploadUrl = 'http://localhost:8080/api/uploads/';

  constructor(private http: HttpClient) { }

  uploadImage(file: File): Observable<{ fileDownloadUri: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ fileDownloadUri: string }>(this.uploadUrl, formData, {
      responseType: 'json',
      headers: this.createAuthHeader()
    });
  }

  private createAuthHeader(): HttpHeaders {
    return new HttpHeaders().set(
        'Authorization',
        'Bearer ' + StorageService.getToken()
    );
  }

}
