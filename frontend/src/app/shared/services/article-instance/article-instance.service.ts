import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {StorageService} from "../storage/storage.service";

export interface ArticleInstanceDto {
  id?: number; // wird vom Backend vergeben
  status: string;
  inventoryNumber?: string | null; // vom Backend gesetzt
}


@Injectable({
  providedIn: 'root'
})
export class ArticleInstanceService {
  private apiUrl = 'http://localhost:8080/api/articles';

  constructor(private http: HttpClient) {}

  getInstances(articleId: number): Observable<ArticleInstanceDto[]> {
    return this.http.get<ArticleInstanceDto[]>(`${this.apiUrl}/${articleId}/instances`);
  }

  updateInstance(articleId: number, instanceId: number, instance: ArticleInstanceDto): Observable<ArticleInstanceDto> {
    return this.http.put<ArticleInstanceDto>(`${this.apiUrl}/${articleId}/instances/${instanceId}`, instance, {
      headers: this.createAuthHeader()
    });
  }

  deleteInstance(articleId: number, instanceId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${articleId}/instances/${instanceId}`, {
      headers: this.createAuthHeader()
    });
  }

  addInstance(articleId: number, instance: ArticleInstanceDto): Observable<ArticleInstanceDto> {
    return this.http.post<ArticleInstanceDto>(`${this.apiUrl}/${articleId}/instances`, instance, {
      headers: this.createAuthHeader()
    });
  }

  private createAuthHeader(): HttpHeaders {
    return new HttpHeaders().set('Authorization', 'Bearer ' + StorageService.getToken());
  }
}
