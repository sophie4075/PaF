import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {NavbarComponent} from './shared/components/navigation/navbar/navbar.component';
import {StorageService} from "./shared/services/storage/storage.service";
import {FooterComponent} from "./shared/components/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, RouterLink, FooterComponent],
  template: `
    <app-navbar
        [isCustomerLoggedIn]="isCustomerLoggedIn"
        [isAdminLoggedIn]="isAdminLoggedIn"
        [isStaffLoggedIn]="isStaffLoggedIn"
    ></app-navbar>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `,
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit{
  title = 'rentify_frontend';

  isCustomerLoggedIn: boolean = StorageService.getUserRoler() === "BUSINESS_CLIENT" || StorageService.getUserRoler() === "BUSINESS_CLIENT";
  isAdminLoggedIn: boolean = StorageService.isAdminLoggedIn();
  isStaffLoggedIn: boolean = StorageService.isStaffLoggedIn();

  constructor(private router: Router) {

  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if(event.constructor.name === "NavigationEnd"){
        this.isCustomerLoggedIn = StorageService.getUserRoler() === "PRIVATE_CLIENT" || StorageService.getUserRoler() === "BUSINESS_CLIENT";
        this.isAdminLoggedIn = StorageService.isAdminLoggedIn();
        this.isStaffLoggedIn = StorageService.isStaffLoggedIn();
      }
    })
  }
}
