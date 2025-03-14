import {Component, OnDestroy, OnInit} from '@angular/core';
import {CartItem, CartService} from "../../services/cart/cart.service";
import {RentalService} from "../../services/rental/rental.service";
import {CurrencyPipe, DatePipe, JsonPipe, NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {interval, Subscription} from "rxjs";
import {ArticleService} from "../../services/article/article.service";

@Component({
    selector: 'app-shopping-cart',
    standalone: true,
    imports: [
        DatePipe,
        CurrencyPipe,
        NgOptimizedImage,
        RouterLink,
        FormsModule,
        JsonPipe
    ],
    templateUrl: './shopping-cart.component.html',
    styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent implements OnInit, OnDestroy {

    cartItems: CartItem[] = [];
    totalPrice: number = 0;
    availabilityWarnings: { [key: string]: string } = {};

    private availabilitySubscription!: Subscription;


    constructor(private cartService: CartService,
                private rentalService: RentalService,
                private articleService: ArticleService) {
    }


    ngOnInit(): void {
        this.cartService.items$.subscribe(items => {
            this.cartItems = items;
            this.updateTotalPrice();
        });

        this.availabilitySubscription = interval(60000).subscribe(() => {
            this.refreshAvailability();
        });
    }

    ngOnDestroy(): void {
        if (this.availabilitySubscription) {
            this.availabilitySubscription.unsubscribe();
        }
    }


    updateQuantity(index: number, value: string): void {
        const quantity = parseInt(value, 10);
        if (!isNaN(quantity) && quantity > 0) {
            this.cartService.updateQuantity(index, quantity);
            this.updateTotalPrice();
            this.refreshAvailability();
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
        if (item.dailyPrice) return item.dailyPrice * days * item.quantity;
        //TODO? -> retry getting Price from Backend
        return 0
    }

    updateTotalPrice(): void {
        this.totalPrice = this.cartItems.reduce((sum, item) => sum + this.computeItemPrice(item), 0);
    }

    onCheckout() {

        Promise.all(this.refreshAvailability()).then(() => {

            if (this.unavailableItems.length > 0) {
                const message = `Not all items are available::\n${this.unavailableItems.join("\n")}\nWould you like to continue anyway?`;
                if (!confirm(message)) {
                    return;
                }
            }
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

            this.rentalService.createRental(rentalPayload).subscribe(
                res => {
                    console.log('Rental created successfully:', res);
                    this.cartService.clearCart();
                },
                err => {
                    console.error('Error creating rental', err);
                }
            );
        }).catch(error => {
            console.error("Error while checking availability", error);
        });

    }

    computeVAT(): number {
        const vatRate = 0.19;
        return this.totalPrice * (vatRate / (1 + vatRate));
    }

    computeNetPrice(): number {
        const vatRate = 0.19;
        return this.totalPrice / (1 + vatRate)
    }

    unavailableItems: string[] = [];


    refreshAvailability(): Promise<any>[] {
        const formatDate = (date: string | Date): string => {
            const d = new Date(date);
            return d.getFullYear() + '-' +
                String(d.getMonth() + 1).padStart(2, '0') + '-' +
                String(d.getDate()).padStart(2, '0');
        };

        const groups: { [key: string]: { articleId: number; rentalStart: Date; rentalEnd: Date; quantity: number; indices: number[]; articleName: string } } = {};

        this.cartItems.forEach((item, index) => {
            const key = `${item.articleId}-${formatDate(item.rentalStart)}-${formatDate(item.rentalEnd)}`;
            if (groups[key]) {
                groups[key].quantity += item.quantity;
                groups[key].indices.push(index);
            } else {
                groups[key] = {
                    articleId: item.articleId,
                    rentalStart: item.rentalStart,
                    rentalEnd: item.rentalEnd,
                    quantity: item.quantity,
                    indices: [index],
                    articleName: item.articleName
                };
            }
        });

        this.unavailableItems = [];

        return Object.keys(groups).map(async key => {
            const group = groups[key];
            try {
                const result = await this.articleService.checkAvailability(group.articleId, group.rentalStart, group.rentalEnd).toPromise();
                let availableCount = 0;
                if (result?.availableInstances?.length) availableCount = result.availableInstances?.length;

                if (availableCount < group.quantity) {
                    if (availableCount === 0) {
                        group.indices.forEach(index => this.cartService.removeItem(index));
                        this.unavailableItems.push(group.articleName);
                    } else {
                        const firstIndex = group.indices[0];
                        this.cartService.updateQuantity(firstIndex, availableCount);
                        for (let i = 1; i < group.indices.length; i++) {
                            this.cartService.removeItem(group.indices[i]);
                        }
                        this.availabilityWarnings[key] = `Not enough articles available. The quantity of ${group.articleName} has been reduced to ${availableCount}`;
                    }
                } else {
                    delete this.availabilityWarnings[key];
                }
                this.updateTotalPrice();
            } catch (error) {
                console.error("Error during availability check for group", key, error);
            }
        });
    }



}
