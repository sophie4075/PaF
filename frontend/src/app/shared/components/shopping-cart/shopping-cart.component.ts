import {Component, OnInit} from '@angular/core';
import {CartItem, CartService} from "../../services/cart/cart.service";
import {RentalService} from "../../services/rental/rental.service";
import {CurrencyPipe, DatePipe, NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [
    DatePipe,
    CurrencyPipe,
    NgOptimizedImage,
    RouterLink,
    FormsModule
  ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent implements OnInit{

  cartItems: CartItem[] = [];
  totalPrice: number = 0;

  constructor(private cartService: CartService,
              private rentalService: RentalService) {}

  ngOnInit(): void {
    this.cartService.items$.subscribe(items => {
      this.cartItems = items;
      this.updateTotalPrice();
    });
  }

  updateQuantity(index: number, value: string): void {
    const quantity = parseInt(value, 10);
    if (!isNaN(quantity) && quantity > 0) {
      this.cartService.updateQuantity(index, quantity);
      this.updateTotalPrice();
    }
  }

  removeItem(index: number): void {
    this.cartService.removeItem(index);
    this.updateTotalPrice();
  }

  computeItemPrice(item: CartItem): number {
    const start = new Date(item.rentalStart).getTime();
    const end = new Date(item.rentalEnd).getTime();
    const days = Math.floor((end - start) / (1000 * 3600 * 24));
    if(item.dailyPrice)  return item.dailyPrice * days * item.quantity;
    //TODO? -> retry getting Price from Backend
    return 0
  }

  updateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce((sum, item) => sum + this.computeItemPrice(item), 0);
  }


  onCheckout() {
    const rentalPayload = {
      rental: {
        rentalStatus: 'PENDING'
      },
      articleRentals: this.cartItems.map(item => ({
        articleId: item.articleId,
        rentalStart: item.rentalStart.toISOString().split('T')[0],
        rentalEnd: item.rentalEnd.toISOString().split('T')[0],
        quantity: item.quantity
      }))
    };


    // Check availability first -> inform customer if items turned OOS

    this.rentalService.createRental(rentalPayload).subscribe(
        res => {
          console.log('Rental created successfully:', res);
          this.cartService.clearCart();
        },
        err => {
          console.error('Error creating rental', err);
        }
    );
  }

  computeVAT(): number {
    const vatRate = 0.19;
    return this.totalPrice * (vatRate / (1 + vatRate));
  }

  computeGrossPrice(): number {
    const vatRate = 0.19;
    return this.totalPrice * (1 + vatRate);
  }




}
