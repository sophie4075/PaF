import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from "rxjs";


const BASE_URL=["http://localhost:8080"]

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  register(registerReq: any){
    return this.http.post(BASE_URL + "/api/auth/register", registerReq)
  }

  login(loginReq: any):Observable<any>{
    return this.http.post(BASE_URL + "/api/auth/login", loginReq);
  }

  sendMagicLink(email: string) {
    return this.http.post(BASE_URL + "/api/auth/magic", { email });
  }


}
