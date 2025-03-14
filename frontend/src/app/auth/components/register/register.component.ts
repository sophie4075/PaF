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
  templateUrl: './register.component.html',
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
        this._snackBar.open('Registrierung erfolgreich!', '🎉', {
          duration: 5000,
          panelClass: ['success-snackbar'],
        });
        this.router.navigateByUrl("/login");
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Ein Fehler ist aufgetreten.';
        this._snackBar.open(`Error: ${errorMessage}`, '🤖', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

}

