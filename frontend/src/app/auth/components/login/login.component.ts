import { Component } from '@angular/core';
import {MatButton} from "@angular/material/button";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {StorageService} from "../../../shared/services/storage/storage.service";
import {AuthService} from "../../../shared/services/auth/auth.service";

@Component({
  selector: 'app-login',
  standalone: true,
    imports: [
        MatButton,
        ReactiveFormsModule,
        RouterLink
    ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm!: FormGroup;
  returnUrl: string = '/';

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

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this.authService.login(this.loginForm.value).subscribe((res) => {
        console.log(res);
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
      })
    } else {
      console.debug('Form not valid');
    }
  }

}
