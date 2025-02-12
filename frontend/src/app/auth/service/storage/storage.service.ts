import { Injectable } from '@angular/core';

const TOKEN = "token";
const USER = "user"

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  static saveToken(token:string):void {
    console.log("save Token is called")
    window.localStorage.removeItem(TOKEN)
    window.localStorage.setItem(TOKEN, token)
  }

  static saveUser(user:any):void {
    console.log("Save user is called")
    window.localStorage.removeItem(USER)
    window.localStorage.setItem(USER, JSON.stringify(user));
  }

  static getToken():string | null {
    return window.localStorage.getItem(TOKEN)
  }

  static getUser(){
    return JSON.parse(<string>localStorage.getItem(USER));
  }

  static getUserRoler():string{
    const user = this.getUser();
    if(!user) return ""
    return user.role
  }

  static isAdminLoggedIn():boolean{
    if(!this.getToken()) return false;

    const role:string = this.getUserRoler();
    console.log("USER ROLE: ", role);

    return role === "ADMIN"

  }


  static isStaffLoggedIn():boolean{
    if(!this.getToken()) return false;

    const role:string = this.getUserRoler();
    console.log("USER ROLE: ", role);
    return role === "STAFF"
  }

  static logout(): void{
    window.localStorage.removeItem(TOKEN);
    window.localStorage.removeItem(USER);

  }
}
