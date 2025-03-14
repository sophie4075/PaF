import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

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
    return this.http.put<ArticleInstanceDto>(`${this.apiUrl}/${articleId}/instances/${instanceId}`, instance);
  }

  deleteInstance(articleId: number, instanceId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${articleId}/instances/${instanceId}`);
  }

  addInstance(articleId: number, instance: ArticleInstanceDto): Observable<ArticleInstanceDto> {
    return this.http.post<ArticleInstanceDto>(`${this.apiUrl}/${articleId}/instances`, instance);
  }
}
