import { Injectable } from '@angular/core';
import {map, Observable} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Category} from "../category/category.service";

export interface Article {
  id?: number;
  bezeichnung: string;
  beschreibung: string;
  stueckzahl: number;
  grundpreis: number;
  bildUrl: string;
  //category: { id: number };
  categories: Category[]
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

  //TODO JWT AUTH
  createArticle(article: Article): Observable<Article> {
    return this.http.post<Article>(this.apiUrl, article);
  }

  //TODO JWT AUTH
  updateArticle(article: Article): Observable<Article> {
    if (!article.id) {
      throw new Error('Article ID is missing for update');
    }
    return this.http.put<Article>(`${this.apiUrl}/${article.id}`, article);
  }

  //TODO JWT AUTH
  deleteArticle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  generateDescriptionForName(bezeichnung: string): Observable<string> {
    return this.http.post(
        `${this.apiUrl}/generate-description-by-name`,
        { bezeichnung },
        { responseType: 'text' }
    );
  }

  getFilteredArticles(filters: any): Observable<Article[]> {
    const params: any = {
      minPrice: filters.priceRange[0].toString(),
      maxPrice: filters.priceRange[1].toString(),
      //YYYY-MM-DD
      startDate: filters.startDate,
      endDate: filters.endDate
    };

    if (filters.selectedCategories && filters.selectedCategories.length > 0) {
      params.categoryIds = filters.selectedCategories.map((id: any) => id.toString());
    } else {
      params.categoryIds = [];
    }

    return this.http.get<Article[]>(`${this.apiUrl}/filter`, { params });
  }


  searchArticles(query: string): Observable<Article[]> {
    return this.getArticles().pipe(
        map(articles => articles.filter(article =>
            article.bezeichnung.toLowerCase().includes(query.toLowerCase())
        ))
    );
  }

  patchArticle(id: number, patch: any): Observable<Article> {
    return this.http.patch<Article>(`${this.apiUrl}/${id}`, patch);
  }

  checkAvailability(articleId: number, start: Date, end: Date): Observable<{ available: boolean, totalPrice?: number, availableInstances?: number[] }> {
    const params = new HttpParams()
        .set('articleId', articleId.toString())
        .set('startDate', start.toISOString().split('T')[0])  // Format YYYY-MM-DD
        .set('endDate', end.toISOString().split('T')[0]);
    return this.http.get<{ available: boolean, totalPrice?: number, availableInstances?: number[]}>(`${this.apiUrl}/availability`, { params });
  }



}
