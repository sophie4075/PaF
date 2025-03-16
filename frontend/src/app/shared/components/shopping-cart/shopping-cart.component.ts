import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {CartItem, CartService} from "../../services/cart/cart.service";
import {RentalService} from "../../services/rental/rental.service";
import {CurrencyPipe, DatePipe, JsonPipe, NgOptimizedImage} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {interval, Subscription} from "rxjs";
import {ArticleService} from "../../services/article/article.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {StorageService} from "../../services/storage/storage.service";

@Component({
    selector: 'app-shopping-cart',
    standalone: true,
    imports: [
        DatePipe,
        CurrencyPipe,
        NgOptimizedImage,
        RouterLink,
        FormsModule,
        JsonPipe,
        MatProgressSpinner
    ],
    template: `
        <section>
            <div class="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <div class="mx-auto max-w-3xl">
                    <div class="text-center">
                        <h1 class="text-xl font-bold text-gray-900 sm:text-3xl">Your Cart</h1>
                    </div>

                    <div class="mt-8">

                        @if (!cartItems.length) {
                            <div class="flex-col flex gap-4 justify-center text-center items-center">
                                <p>is empty</p>
                                <img ngSrc="/assets/shopping.png" priority alt="Astronaut sitting in an empty cart"
                                     height="512"
                                     width="512">
                                <button routerLink="/products" class="bg-blue-500 text-white py-2 px-4 rounded">
                                    Browse Articles
                                </button>
                            </div>

                        } @else {

                            <ul class="space-y-4 mb-8">

                                @for (item of cartItems; track $index) {
                                    <li class="flex items-center gap-4">
                                        <div>
                                            <h3 class="text-sm text-gray-900">{{ item.articleName }}</h3>

                                            <dl class="mt-0.5 space-y-px text-[10px] text-gray-600">

                                                <div>
                                                    <dt class="inline">Rental period:</dt>
                                                    <dd class="inline">
                                                        {{ item.rentalStart | date: 'dd.MM.yyyy' }}
                                                        - {{ item.rentalEnd | date: 'dd.MM.yyyy' }}
                                                    </dd>
                                                </div>

                                                <div>
                                                    <dt class="inline">Price:</dt>
                                                    <dd class="inline">
                                                        {{ computeItemPrice(item) | currency:'EUR':'symbol':'1.2-2':'de-DE' }}
                                                    </dd>
                                                </div>

                                                @if (availabilityWarnings[item.articleId + '-' + (item.rentalStart | date:'yyyy-MM-dd') + '-' + (item.rentalEnd | date:'yyyy-MM-dd')]) {
                                                    <div class="text-red-600 text-xs mt-1">
                                                        {{ availabilityWarnings[item.articleId + '-' + (item.rentalStart | date:'yyyy-MM-dd') + '-' + (item.rentalEnd | date:'yyyy-MM-dd')] }}
                                                    </div>
                                                }


                                            </dl>
                                        </div>

                                        <div class="flex flex-1 items-center justify-end gap-2">
                                            <form>
                                                <label for="quantity{{$index}}" class="sr-only"> Quantity </label>

                                                <input
                                                        type="number"
                                                        min="1"
                                                        id="quantity{{$index}}"
                                                        [ngModel]="item.quantity"
                                                        [ngModelOptions]="{standalone: true}"
                                                        (ngModelChange)="updateQuantity($index, $event)"
                                                        class="h-8 w-12 rounded-sm border-gray-200 bg-gray-50 p-0 text-center text-xs text-gray-600 [-moz-appearance:_textfield] focus:outline-hidden [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                                                />
                                            </form>

                                            <button class="text-gray-600 transition hover:text-red-600"
                                                    (click)="removeItem($index)">
                                                <span class="sr-only">Remove item</span>

                                                <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="1.5"
                                                        stroke="currentColor"
                                                        class="size-4"
                                                >
                                                    <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </li>
                                }

                            </ul>


                            @if (unavailableItems.length) {
                                <div class="bg-red-100 text-red-700 p-2 rounded mb-4 mt-4">
                                    <p class="text-sm">Die folgenden Artikel sind aktuell nicht mehr
                                        verfügbar: {{ unavailableItems.join(', ') }}.
                                    </p>
                                </div>
                            }

                            <small class="text-sm text-gray-500">Items in your cart are not reserved, availability may
                                vary</small>


                            <div class="flex justify-end border-t border-gray-100 pt-8">
                                <div class="w-screen max-w-lg space-y-4">
                                    <dl class="space-y-0.5 text-sm text-gray-700">

                                        <div class="flex justify-between">
                                            <dt>Net Price</dt>
                                            <dd>{{ computeNetPrice() | currency:'EUR':'symbol':'1.2-2':'de-DE' }}</dd>
                                        </div>

                                        <div class="flex justify-between">
                                            <dt>VAT</dt>
                                            <dd>{{ computeVAT() | currency:'EUR':'symbol':'1.2-2':'de-DE' }}</dd>
                                        </div>

                                        <div class="flex justify-between !text-base font-medium">
                                            <dt>Total</dt>
                                            <dd>{{ totalPrice | currency:'EUR':'symbol':'1.2-2':'de-DE' }}</dd>
                                        </div>

                                    </dl>


                                    <div class="flex justify-end">
                                        <button (click)="onCheckout()" class="bg-blue-500 text-white py-2 px-4 rounded"
                                                [disabled]="loading">
                                            @if (!loading) {
                                                Rent
                                            } @else {
                                                <mat-progress-spinner diameter="20"
                                                                      mode="indeterminate"></mat-progress-spinner>
                                            }
                                        </button>
                                    </div>


                                </div>
                            </div>

                        }
                    </div>
                </div>
            </div>
        </section>
    `,
})
export class ShoppingCartComponent implements OnInit, OnDestroy {

    cartItems: CartItem[] = [];
    totalPrice: number = 0;
    loading: boolean = false
    availabilityWarnings: { [key: string]: string } = {};
    private _snackBar = inject(MatSnackBar);

    private availabilitySubscription!: Subscription;


    constructor(private cartService: CartService,
                private rentalService: RentalService,
                private articleService: ArticleService,
                private storageSerice: StorageService,
                private router: Router) {
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

        this.loading = true;
        Promise.all(this.refreshAvailability()).then(() => {

            if (this.unavailableItems.length > 0) {
                const message = `Not all items are available::\n${this.unavailableItems.join("\n")}\nWould you like to continue anyway?`;
                if (!confirm(message)) {
                    this.loading = false;
                    return;
                }
            }
            const rentalPayload = {
                rental: {
                    rentalStatus: 'ACTIVE'
                },
                articleRentals: this.cartItems.map(item => ({
                    articleId: item.articleId,
                    rentalStart: this.cartService.formatLocalDate(item.rentalStart),
                    rentalEnd: this.cartService.formatLocalDate(item.rentalEnd),
                    quantity: item.quantity
                }))
            };

            this.rentalService.createRental(rentalPayload).subscribe(
                {
                    next: (res) => {
                        this.loading = false
                        this.cartService.clearCart();
                        this._snackBar.open('Articles rented!', '🎉', {
                            duration: 5000,
                            panelClass: ['success-snackbar'],
                        });

                        if(StorageService.isStaffLoggedIn() || StorageService.isAdminLoggedIn()){
                            this.router.navigateByUrl("/admin");
                        } else {
                            this.router.navigateByUrl("/customer");
                        }

                    },
                    error: (err) => {
                        this.loading = false
                        const errorMessage = err.error?.message || 'Ein Fehler ist aufgetreten.';
                        this._snackBar.open(`Error: ${errorMessage}`, '🤖', {
                            duration: 5000,
                            panelClass: ['error-snackbar'],
                        });
                    },
                }
            );
        }).catch(error => {
            this.loading = false
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

        const groups: {
            [key: string]: {
                articleId: number;
                rentalStart: Date;
                rentalEnd: Date;
                quantity: number;
                indices: number[];
                articleName: string
            }
        } = {};

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
