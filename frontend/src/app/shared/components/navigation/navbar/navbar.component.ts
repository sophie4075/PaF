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
  templateUrl: './navbar.component.html',
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
