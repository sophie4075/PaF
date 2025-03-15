import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
    articleName: string;
    articleId: number;
    rentalStart: Date;
    rentalEnd: Date;
    dailyPrice: number | undefined;
    quantity: number;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private readonly storageKey = 'cartItems';

    private loadInitialItems(): CartItem[] {
        const savedItems = localStorage.getItem(this.storageKey);
        return savedItems ? JSON.parse(savedItems, this.dateReviver) : [];
    }

    private itemsSubject: BehaviorSubject<CartItem[]> = new BehaviorSubject<CartItem[]>(this.loadInitialItems());
    public items$ = this.itemsSubject.asObservable();

    addItem(newItem: CartItem): void {
        const items = this.itemsSubject.getValue();
        const index = items.findIndex(item =>
            item.articleId === newItem.articleId &&
            this.formatLocalDate(new Date(item.rentalStart)) === this.formatLocalDate(new Date(newItem.rentalStart)) &&
            this.formatLocalDate(new Date(item.rentalEnd)) === this.formatLocalDate(new Date(newItem.rentalEnd))
        );
        if (index > -1) {
            items[index].quantity += newItem.quantity;
        } else {
            items.push(newItem);
        }
        this.itemsSubject.next([...items]);
        this.saveToStorage(items);
    }

    updateQuantity(index: number, quantity: number): void {
        const items = this.itemsSubject.getValue();
        if (index >= 0 && index < items.length) {
            items[index].quantity = quantity;
            this.itemsSubject.next([...items]);
            this.saveToStorage(items);
        }
    }

    removeItem(index: number): void {
        const items = this.itemsSubject.getValue();
        items.splice(index, 1);
        this.itemsSubject.next([...items]);
        this.saveToStorage(items);
    }

    clearCart(): void {
        this.itemsSubject.next([]);
        localStorage.removeItem(this.storageKey);
    }

    private saveToStorage(items: CartItem[]): void {
        //localStorage.setItem(this.storageKey, JSON.stringify(items));
        const itemsToSave = items.map(item => ({
            ...item,
            rentalStart: this.formatLocalDate(item.rentalStart),
            rentalEnd: this.formatLocalDate(item.rentalEnd)
        }));
        localStorage.setItem(this.storageKey, JSON.stringify(itemsToSave));
    }

    private dateReviver(key: string, value: any): any {
        if (key === 'rentalStart' || key === 'rentalEnd') {
            return new Date(value);
        }
        return value;
    }

    formatLocalDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

}
