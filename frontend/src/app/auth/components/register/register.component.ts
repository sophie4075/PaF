import {Component, inject, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {RouterLink} from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';

import {NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';

import {AuthService} from '../../../shared/services/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSnackBarModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIcon,
    NgIf
  ],
  template:`
    <section class="min-h-full">
      <div class="pb-5">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto">

          <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-xl xl:p-0">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-4xl">
                Registrieren
              </h1>
              <form class="space-y-4 md:space-y-6" [formGroup]="registerForm" (ngSubmit)="onSubmit()">

                <div>
                  <label for="firstName" class="block mb-2 text-sm font-medium text-gray-900">Vorname</label>
                  <input id="firstName" type="text" formControlName="firstName" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:placeholder-gray-400 dark: dark:focus:ring-blue-500">
                  @if(registerForm.get('firstName')?.invalid && registerForm.get('firstName')?.touched){
                    <div>
                      <p class="text-red-600 text-sm">Vorname ist erforderlich.</p>
                    </div>
                  }
                </div>

                <div>
                  <label for="lastName" class="block mb-2 text-sm font-medium text-gray-900 ">Nachname</label>
                  <input id="lastName" type="text" formControlName="lastName" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  @if(registerForm.get('lastName')?.invalid && registerForm.get('lastName')?.touched){
                    <div>
                      <p class="text-red-600 text-sm">Nachname ist erforderlich.</p>
                    </div>
                  }
                </div>

                <div>
                  <label for="email" class="block mb-2 text-sm font-medium text-gray-900 ">E-Mail</label>
                  <input id="email" type="email" formControlName="email" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  @if(registerForm.get('email')?.hasError('required') && registerForm.get('email')?.touched){
                    <div>
                      <p class="text-red-600 text-sm">E-Mail ist erforderlich.</p>
                    </div>
                  } @else if (registerForm.get('email')?.hasError('email') && registerForm.get('email')?.touched){
                    <div>
                      <p class="text-red-600 text-sm">Bitte geben Sie eine gültige E-Mail ein.</p>
                    </div>
                  }
                </div>

                <fieldset formGroupName="businessDetailsDto" class="space-y-4 md:space-y-6">
                  <div>
                    <label for="companyName" class="block mb-2 text-sm font-medium text-gray-900 ">Firmenname (optional)</label>
                    <input id="companyName" type="text" formControlName="companyName" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  </div>

                  <div>
                    <label for="vatId" class="block mb-2 text-sm font-medium text-gray-900 ">USt-ID (optional)</label>
                    <input id="vatId" type="text" formControlName="vatId" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  </div>

                </fieldset>

                <fieldset formGroupName="addressDto" class="space-y-4 md:space-y-6">

                  <div>
                    <label for="street" class="block mb-2 text-sm font-medium text-gray-900 ">Straße und Hausnummer</label>
                    <input id="street" type="text" formControlName="street" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    @if(registerForm.get('addressDto.street')?.hasError('required') && registerForm.get('addressDto.street')?.touched){
                      <div>
                        <p class="text-red-600 text-sm">Straße und Hausnummer ist erforderlich.</p>
                      </div>
                    } @else if (registerForm.get('addressDto.street')?.hasError('pattern') && registerForm.get('addressDto.street')?.touched){
                      <div>
                        <p class="text-red-600 text-sm">
                          Bitte geben Sie Straße und Hausnummer ein, zum Beispiel: Musterstraße 1.
                        </p>
                      </div>
                    }
                  </div>

                  <div>
                    <label for="postalCode" class="block mb-2 text-sm font-medium text-gray-900 ">Postleitzahl</label>
                    <input id="postalCode" type="text" formControlName="postalCode" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    @if(registerForm.get('addressDto.postalCode')?.hasError('required') && registerForm.get('addressDto.postalCode')?.touched){
                      <div>
                        <p class="text-red-600 text-sm">Postleitzahl ist erforderlich.</p>
                      </div>
                    } @else if (registerForm.get('addressDto.postalCode')?.hasError('pattern')&& registerForm.get('addressDto.postalCode')?.touched){
                      <div>
                        <p class="text-red-600 text-sm">Bitte geben Sie eine gültige Postleitzahl ein (5 Ziffern).</p>
                      </div>
                    }
                  </div>

                  <div>
                    <label for="city" class="block mb-2 text-sm font-medium text-gray-900">Stadt</label>
                    <input id="city" type="text" formControlName="city" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    @if(registerForm.get('addressDto.city')?.hasError('required') && registerForm.get('addressDto.city')?.touched){
                      <div>
                        <p class="text-red-600 text-sm">Stadt ist erforderlich.</p>
                      </div>
                    } @else if (registerForm.get('addressDto.city')?.hasError('pattern') && registerForm.get('addressDto.city')?.touched){
                      <div>
                        <p class="text-red-600 text-sm">
                          Der Ortsname darf nicht länger als 60 Zeichen sein.
                        </p>
                      </div>
                    }
                  </div>

                  <div>
                    <label for="state" class="block mb-2 text-sm font-medium text-gray-900 ">Bundesland</label>
                    <input id="state" type="text" formControlName="state" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    @if(registerForm.get('addressDto.state')?.hasError('required') && registerForm.get('addressDto.state')?.touched){
                      <div>
                        <p class="text-red-600 text-sm">Bundesland ist erforderlich.</p>
                      </div>
                    }
                  </div>

                  <div>
                    <label for="country" class="block mb-2 text-sm font-medium text-gray-900 ">Land</label>
                    <input id="country" type="text" formControlName="country" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    @if(registerForm.get('addressDto.country')?.hasError('required') && registerForm.get('addressDto.country')?.touched){
                      <div>
                        <p class="text-red-600 text-sm">Land ist erforderlich.</p>
                      </div>
                    } @else if (registerForm.get('addressDto.country')?.hasError('pattern') && registerForm.get('addressDto.country')?.touched){
                      <div>
                        <p class="text-red-600 text-sm">Bitte geben Sie eine gültiges Land ein.</p>
                      </div>
                    }
                  </div>

                </fieldset>

                <div>
                  <label for="password" class="block mb-2 text-sm font-medium text-gray-900 ">Passwort</label>
                  <input id="password" type="password" formControlName="password" class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  <p class="text-gray-500 text-xs mt-1">
                    Mindestens 8 Zeichen, inkl. Groß-, Kleinbuchstaben, Zahlen & Sonderzeichen.
                  </p>
                  @if(registerForm.get('password')?.hasError('required') && registerForm.get('password')?.touched){
                    <div>
                      <p class="text-red-600 text-sm">Password ist erforderlich</p>
                    </div>
                  } @else if (registerForm.get('password')?.hasError('pattern') && registerForm.get('password')?.touched){
                    <div>
                      Ihr Passwort muss:
                      <ul class="list-disc pl-5">
                        <li>Zwischen 8 und 16 Zeichen lang sein</li>
                        <li>Mindestens eine Zahl enthalten</li>
                        <li>Mindestens einen Kleinbuchstaben enthalten</li>
                        <li>Mindestens einen Großbuchstaben enthalten</li>
                        <li>Mindestens ein Sonderzeichen enthalten (z. B. &#64;, $, !, %, *, ?, &)</li>
                        <li>Darf keine Leerzeichen enthalten</li>
                      </ul>
                    </div>
                  }
                </div>

                <div>
                  <label for="repeatPassword" class="block mb-2 text-sm font-medium text-gray-900">Passwort wiederholen</label>
                  <input
                      id="repeatPassword"
                      type="password"
                      formControlName="repeatPassword"
                      class="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  />
                  @if(registerForm.errors?.['passwordsDoNotMatch'] && registerForm.get('repeatPassword')?.touched){
                    <div>
                      <p class="text-red-600 text-sm">Die Passwörter stimmen nicht überein.</p>
                    </div>
                  }
                </div>

                <div class="flex justify-center">
                  <button
                      mat-raised-button
                      [disabled]="registerForm.invalid"
                      type="submit">
                    Registrieren
                  </button>
                </div>

                <p class="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                  Already have an account? <a routerLink="/login" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .success-snackbar {
        background-color: #4caf50;
        color: #fff;
      }

      .error-snackbar {
        background-color: #f44336;
        color: #fff;
      }
    `,
  ],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  private _snackBar = inject(MatSnackBar);


  constructor(private fb: FormBuilder,
              private authService:AuthService,
              private router: Router) {
  }

  ngOnInit() {
    this.registerForm = this.fb.group(
      {
        firstName: ['',
          [
            Validators.required,
            Validators.pattern(/^[A-Za-zäöüßÄÖÜ\s\-]{1,50}/),
          ]
        ],
        lastName: ['',
          [
            Validators.required,
            Validators.pattern(/^[A-Za-zäöüßÄÖÜ\s\-]{1,30}/),
          ]
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,16}$/),
          ],
        ],
        repeatPassword: ['', Validators.required],
        addressDto: this.fb.group({
          street: [
            '',
            [
              Validators.required,
              Validators.pattern(/^[A-Za-zäöüßÄÖÜ\s\-]{1,50}\s\d{1,4}[a-zA-Z]?(\/\d{1,3})?$/),
            ],
          ],
          city: [
            '',
            [
              Validators.required,
              Validators.pattern(/^[A-Za-zäöüßÄÖÜ\s]{1,60}$/),
            ],
          ],
          state: ['', Validators.required],
          postalCode: [
            '',
            [
              Validators.required,
              Validators.pattern(/^\d{5}$|^\d{4}$/),
            ],
          ],
          country: [
            '',
            [
              Validators.required,
              Validators.pattern(/^[A-Za-zäöüßÄÖÜ\s]{1,58}$/),
            ],
          ],
        }),
        businessDetailsDto: this.fb.group({
          companyName: [''],
          vatId: [''],
        }),
      },
      { validators: this.passwordsMatchValidator }
    );
  }



  private passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const password = group.get('password')?.value;
    const repeatPassword = group.get('repeatPassword')?.value;
    return password === repeatPassword ? null : { passwordsDoNotMatch: true };
  };

  onSubmit() {

    const formValue = this.registerForm.value;
    const {repeatPassword, businessDetailsDto, ...payload} = formValue;

    if (businessDetailsDto.companyName === '' && businessDetailsDto.vatId === '') {
      delete payload.businessDetailsDto;
    } else {
      payload.businessDetailsDto = businessDetailsDto;
    }

    this.authService.register(payload).subscribe({
      next: (res) => {
        this._snackBar.open('Registered successfully!', '🎉', {
          duration: 5000,
          panelClass: ['success-snackbar'],
        });
        this.router.navigateByUrl("/login");
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'An error occurred';
        this._snackBar.open(`Error: ${errorMessage}`, '🤖', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

}

