import {Component, inject, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {StorageService} from "../../../shared/services/storage/storage.service";
import {AuthService} from "../../../shared/services/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'app-login',
  template:
      `
          <section class="min-h-full">
              <div class="pb-5">
                  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto">
                      @if (linkSent) {
                          <div class="flex flex-col items-center justify-center gap-4">
                              <img
                                      class="rounded-[50%]"
                                      ngSrc="https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGsyYmZpb3ozcDFnYWpnY3pxbzVyNnRtMmpmYjdjcDBvZm1oODljdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oz8xSwIOv5FGhZFjq/giphy.gif"
                                      width="300"
                                      height="300"
                                      priority>
                              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl">
                                  Check your Inbox
                              </h1>
                              <p>You’ll receive a login link in your inbox shortly.</p>
                          </div>
                      } @else {
                          <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-xl xl:p-0">
                              <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                                  <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl">
                                      Login
                                  </h1>
                                  <form class="space-y-4 md:space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">


                                      <div>
                                          <label for="email"
                                                 class="block mb-2 text-sm font-medium text-gray-900 ">E-Mail</label>
                                          <input id="email" type="email" formControlName="email"
                                                 class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                          @if (loginForm.get('email')?.hasError('required') && loginForm.get('email')?.touched) {
                                              <div>
                                                  <p class="text-red-600 text-sm">E-Mail is required.</p>
                                              </div>
                                          }
                                      </div>

                                      <div class="flex justify-center flex-col">
                                          <button
                                                  mat-raised-button
                                                  [disabled]="loginForm.invalid || loading"
                                                  type="submit">
                                              @if (!loading) {
                                                  Login
                                              } @else {
                                                  <mat-progress-spinner diameter="20"
                                                                        mode="indeterminate"></mat-progress-spinner>
                                              }

                                          </button>

                                          <a routerLink="/register"
                                             class="mt-4 text-center text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Noch
                                              nicht registriert?</a>

                                      </div>

                                  </form>
                              </div>
                          </div>
                      }


                  </div>
              </div>

          </section>
      `,
  standalone: true,
  imports: [
    MatButton,
    ReactiveFormsModule,
    RouterLink,
    MatProgressSpinner,
    NgOptimizedImage
  ],

})
export class LoginComponent implements OnInit{

  linkSent= false;
  loading = false;
  loginForm!: FormGroup;
  private _snackBar = inject(MatSnackBar);

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router:Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
      }
    );

    const token = this.route.snapshot.queryParams['token'];
    if(token){
      this.router.navigateByUrl('/products');
    }

  }

  onSubmit() {
    if (this.loginForm.valid){
      this.loading = true;
      const email = this.loginForm.value.email;
      this.authService.sendMagicLink(email).subscribe({
        next: () => {
          this._snackBar.open(`A link to log in has been sent to ${email}  ✉️`, 'OK', {
            duration: 5000,
          });
          this.loading = false;
          this.linkSent = true;
        },
        error: (err) => {
          const errorMessage = err.error?.message || 'Error while sending you a link';
          this._snackBar.open(`Error: ${errorMessage}`, '🤖', {
            duration: 5000,
          });
          this.loading = false;
        }
      });
    }
  }




}

