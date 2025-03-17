import {Component, inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {StorageService} from "../../../shared/services/storage/storage.service";
import {AuthService} from "../../../shared/services/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  template:
      `
    <section class="min-h-full">
      <div class="pb-5">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto">

          <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-xl xl:p-0">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl">
                Login
              </h1>
              <form class="space-y-4 md:space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">


                <div>
                  <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">E-Mail</label>
                  <input id="email" type="email" formControlName="email" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  @if(loginForm.get('email')?.hasError('required') && loginForm.get('email')?.touched){
                    <div>
                      <p class="text-red-600 text-sm">E-Mail is required.</p>
                    </div>
                  }
                </div>


                <div>
                  <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Password</label>
                  <input id="password" type="password" formControlName="password" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  @if(loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched){
                    <div>
                      <p class="text-red-600 text-sm">Password is required</p>
                    </div>
                  }
                </div>


                <div class="flex justify-center flex-col">
                  <button
                      mat-raised-button
                      [disabled]="loginForm.invalid"
                      type="submit">
                    Einloggen
                  </button>

                  <a routerLink="/register" class="mt-4 text-center text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Noch nicht registriert?</a>

                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
      
    </section>
  `,
  standalone: true,
    imports: [
        MatButton,
        ReactiveFormsModule,
        RouterLink
    ],

})
export class LoginComponent {

  loginForm!: FormGroup;
  returnUrl: string = '/';
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
        password: ['', Validators.required],
      }
    );

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/customer';

  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.authService.login(this.loginForm.value).subscribe({
        next: (res) => {
          if (res.userId != null){
            const user = {
              id: res.userId,
              role: res.role
            }

            StorageService.saveUser(user);
            StorageService.saveToken(res.token);

            if(!StorageService.getUserRoler() || StorageService.getUserRoler() === "" ){
              return;
            }

            if(StorageService.isAdminLoggedIn() || StorageService.isStaffLoggedIn()){
              this.router.navigateByUrl("/admin")
              return;
            }

            this.router.navigateByUrl(this.returnUrl)

          }

        },
        error: (err) => {
          const errorMessage = err.error?.message || 'An error occurred';
          this._snackBar.open(`Error: ${errorMessage}`, '🤖', {
            duration: 5000,
          });

        }
      })
    } else {
      console.debug('Form not valid');
    }
  }

}

