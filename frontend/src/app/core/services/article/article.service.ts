import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

export interface Article {
  id?: number;
  bezeichnung: string;
  beschreibung: string;
  stueckzahl: number;
  grundpreis: number;
  bildUrl: string;
  category: { id: number };
  articleInstances: Array<{
    status: string;
    inventoryNumber?: string | null;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = 'http://localhost:8080/api/articles';

  constructor(private http: HttpClient) {}

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl);
  }

  getArticleById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  createArticle(article: Article): Observable<Article> {
    return this.http.post<Article>(this.apiUrl, article);
  }

  updateArticle(article: Article): Observable<Article> {
    if (!article.id) {
      throw new Error('Article ID is missing for update');
    }
    return this.http.put<Article>(`${this.apiUrl}/${article.id}`, article);
  }

  deleteArticle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
