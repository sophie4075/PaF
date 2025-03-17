import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template: `
  <footer class="bg-black text-white py-8 home-footer fixed left-0 bottom-0 w-full">
      <div class="container mx-auto text-center">
        <p class="text-sm">&copy; 2025 App Name. All rights reserved.</p>
        <nav class="mt-4">
          <a href="" class="text-sm text-gray-400 hover:text-white">Imprint</a> |
          <a href="" class="text-sm text-gray-400 hover:text-white">Privacy policy</a>
        </nav>
      </div>
    </footer>
  `,
})
export class FooterComponent {
}
