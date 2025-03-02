import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private uploadUrl = 'http://localhost:8080/api/uploads/images';

  constructor(private http: HttpClient) { }

  uploadImage(file: File): Observable<{ fileDownloadUri: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ fileDownloadUri: string }>(this.uploadUrl, formData);
  }

}
