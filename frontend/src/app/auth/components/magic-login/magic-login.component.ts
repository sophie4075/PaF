import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../../shared/services/storage/storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-magic-login',
  standalone: true,
  imports: [
    NgIf
  ],
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen">
      <h1 class="text-2xl font-bold mb-4">Login is being processed...</h1>
      <p *ngIf="errorMessage" class="text-red-500">{{ errorMessage }}</p>
    </div>
  `
})
export class MagicLoginComponent implements OnInit {
  errorMessage: string = '';

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParams['token'];

    if (token) {
      try {
        StorageService.saveToken(token);

        const payload = this.decodeToken(token);
        const user = {
          id: payload?.sub,
          role: payload?.role
        };

        console.log(payload)

        StorageService.saveUser(user);

        this.snackBar.open('Login succeeded! 🎉', 'OK', { duration: 4000 });

        if (user.role === 'ADMIN' || user.role === 'STAFF') {
          this.router.navigateByUrl('/admin');
        } else {
          this.router.navigateByUrl('/customer');
        }

      } catch (error) {
        this.errorMessage = 'Invalid Token!';
        this.snackBar.open('No token found :/', 'OK', { duration: 4000 });
      }
    } else {
      this.errorMessage = 'Kein Token gefunden!';
    }
  }

  decodeToken(token: string): any {
    try {
      const payloadBase64 = token.split('.')[1];
      const decodedPayload = atob(payloadBase64);
      return JSON.parse(decodedPayload);
    } catch (e) {
      console.error('Fehler beim Decodieren des Tokens', e);
      return null;
    }
  }
}

