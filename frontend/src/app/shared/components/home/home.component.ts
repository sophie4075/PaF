import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
    imports: [
        RouterLink
    ],
  template: `
    <!--TODO: Add Icons  -->
    <div class="min-h-screen flex-col flex bg-cover bg-center hero">
      <!-- Hero Section -->
      <main class="flex flex-col items-center justify-center text-center flex-grow px-4 bg-black bg-opacity-50 hero-banner">
        <h1 class="text-5xl lg:text-7xl font-bold drop-shadow-lg text-white">
          High-quality equipment. Simply rented.
        </h1>
        <p class="text-xl lg:text-2xl mt-4 max-w-3xl drop-shadow-md text-white">
          Your access to professional technology: cameras, audio equipment and more - flexible rental with “App Name”.        </p>
        <div class="flex gap-4 mt-6 flex-col md:flex-row">
          <a routerLink="/products"
             class="bg-white text-black border border-white py-3 px-8 rounded-lg text-lg shadow-md hover:bg-gray-400 hover:border-gray-400 transition-all">
            View portfolio
          </a>
          <a routerLink="/register"
             class="bg-transparent border border-white text-white py-3 px-8 rounded-lg text-lg shadow-md hover:bg-white hover:text-black transition-all">
            Register & rent equipment
          </a>
        </div>
      </main>
    </div>

    <section class="bg-white py-20 home-section">
      <div class="container mx-auto text-center px-4">
        <h2 class="text-4xl font-bold text-gray-800">Why App Name?</h2>
        <p class="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          We offer you access to first-class equipment - ideal for streams, podcasts, events and more.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
          <div class="flex flex-col items-center">
            <img src="" alt="Equipment" class="w-16 h-16 mb-4">
            <h3 class="text-xl font-semibold text-gray-800">High-quality equipment</h3>
            <p class="text-gray-600 mt-2">
              Modern equipment, carefully maintained and always ready for your next project.
            </p>
          </div>
          <div class="flex flex-col items-center">
            <img src="" alt="Verfügbarkeit" class="w-16 h-16 mb-4">
            <h3 class="text-xl font-semibold text-gray-800">Real-time availability</h3>
            <p class="text-gray-600 mt-2">
              See which products are available at any time, so you can plan easily and stress-free.
            </p>
          </div>
          <div class="flex flex-col items-center">
            <img src="" alt="Zuverlässig" class="w-16 h-16 mb-4">
            <h3 class="text-xl font-semibold text-gray-800">Reliable service</h3>
            <p class="text-gray-600 mt-2">
              We are at your side with punctual availability, flexible solutions and personal support.
            </p>
          </div>
        </div>
      </div>
    </section>

    <footer class="bg-black text-white py-8 home-footer">
      <div class="container mx-auto text-center">
        <p class="text-sm">&copy; 2025 App Name. All rights reserved.</p>
        <nav class="mt-4">
          <a href="" class="text-sm text-gray-400 hover:text-white">Imprint</a> |
          <a href="" class="text-sm text-gray-400 hover:text-white">Privacy policy</a>
        </nav>
      </div>
    </footer>

  `,
  styles: [
    `
      .hero{
        background-repeat: no-repeat;
        background-image: url("/assets/AdobeStock_61603176.jpeg");
        background-size: cover;
      }
    `,
  ],
})
export class HomeComponent {

}
