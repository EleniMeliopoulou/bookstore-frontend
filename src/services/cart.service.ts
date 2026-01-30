import { Injectable, signal } from "@angular/core";
import { Books } from "../interfaces/interfaces.js";

@Injectable({
    providedIn: 'root'
})
export class CartService {

    private cartItems = signal<Books[]>([]);

    getCartItems = this.cartItems.asReadonly();

    addItem(book: Books): void {
        const currentItems = this.cartItems();

        const existingItem = currentItems.find(item => item.id === book.id);
        if (existingItem) {
            console.log('Already added');
        } else {
            this.cartItems.set([...currentItems, {
                id: book.id,
                title: book.title,
                image: book.image,
                author: book.author,
                rating: book.rating
            }])
        }
    }

    removeItem(bookId: number): void {
        const currentItems = this.cartItems();
        this.cartItems.set(currentItems.filter(item => item.id !== bookId))
    }

    clearCart(): void {
        this.cartItems.set([]);
    }

    getItemCount(): number {
        return this.cartItems().length;
    }

}