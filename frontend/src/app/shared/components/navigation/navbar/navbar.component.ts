import {AfterViewInit, Component, Input} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {StorageService} from "../../../services/storage/storage.service";
import {NgStyle} from "@angular/common";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NgStyle
  ],
  template: `
  <header>
  <div>
    <a routerLink="/" >
    <img src="" alt="Logo" id="logo">
    </a>
  </div>


  <button class="mobile-nav-toggle" aria-controls="navigation" aria-expanded="false"><span class="sr-only">Menu</span>
  </button>

  <nav id="navbar">
      <ul data-visible="false" id="navigation">
          <li><a routerLink="/products" routerLinkActive="active">Products</a></li>
          @if(!isCustomerLoggedIn && !isStaffLoggedIn && !isAdminLoggedIn){
              <li><a routerLink="/login" routerLinkActive="active">Login</a></li>
              <li><a routerLink="/register" routerLinkActive="active">Register</a></li>
          }
          @else if(isCustomerLoggedIn || isStaffLoggedIn || isAdminLoggedIn) {
              @if(isStaffLoggedIn || isAdminLoggedIn){
                  <!-- TODO make Link update dynamically -->
                  <li><a routerLink="/admin/post-article" routerLinkActive="active">Add Article</a></li>
              }
              <li><a [routerLink]="dashboardRoute" routerLinkActive="active">Dashboard</a></li>
              <li><a routerLink="/cart" routerLinkActive="active">Cart</a></li>
              <li><a routerLinkActive="active" (click)="logout()" [ngStyle]="{'cursor': 'pointer'}">Logout</a></li>
          }
      </ul>
  </nav>
</header>
  `,
  styleUrl: '../../../../app.component.css'
})
export class NavbarComponent implements AfterViewInit{

  @Input() isCustomerLoggedIn!: boolean;
  @Input() isAdminLoggedIn!: boolean;
  @Input() isStaffLoggedIn!: boolean;

  constructor(private router: Router) { }

  ngAfterViewInit() {
    const primaryNav = document.querySelector("#navigation") as HTMLElement;
    const navToggle = document.querySelector(".mobile-nav-toggle") as HTMLElement;

    if(!navToggle || !primaryNav) return;

    navToggle.addEventListener('click', () => {
      const visibility = primaryNav.getAttribute('data-visible');

      if (visibility === 'false') {
        primaryNav.setAttribute('data-visible', 'true');
        navToggle.setAttribute('aria-expanded', 'true');
      } else if (visibility === 'true') {
        primaryNav.setAttribute("data-visible", 'false');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    primaryNav.addEventListener('click', () =>{
      const visibility = primaryNav.getAttribute('data-visible');
      if(visibility ==='true'){
        primaryNav.setAttribute("data-visible", 'false');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    })
  }

  get dashboardRoute(): string {
    if (this.isAdminLoggedIn) {
      return '/admin';
    } else if (this.isCustomerLoggedIn) {
      return '/customer';
    } else if (this.isStaffLoggedIn) {
      return '/staff';
    } else {
      return '/';
    }
  }

  logout(){
    StorageService.logout();
    this.router.navigate(['/']);
  }

}
