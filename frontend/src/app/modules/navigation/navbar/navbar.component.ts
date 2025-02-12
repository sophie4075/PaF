import {AfterViewInit, Component} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './navbar.component.html',
  styleUrl: '../../../app.component.css'
})
export class NavbarComponent implements AfterViewInit{

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

}
