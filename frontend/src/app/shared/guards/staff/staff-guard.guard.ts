import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {StorageService} from "../../services/storage/storage.service";

@Injectable({
  providedIn: 'root'
})
export class StaffGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (StorageService.isStaffLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
