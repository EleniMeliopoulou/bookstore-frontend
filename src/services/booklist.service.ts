import { Injectable, inject, signal } from "@angular/core";
import { Books } from "../interfaces/interfaces.js";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

interface LikeResponse{
    bookId: number;
    isLiked: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class BookListService {
    private listItems = signal<Books[]>([]);

    getListItems = this.listItems.asReadonly();

    addItem(book: Books): void {
        const currentItems = this.listItems();

        const existingItem = currentItems.find(item => item.id === book.id);
        if (existingItem) {
            console.log('Already added');
        } else {
            this.listItems.set([...currentItems, {
                id: book.id,
                title: book.title,
                image: book.image,
                author: book.author,
                rating: book.rating
            }])
        }
    }

    removeItem(bookId: number | undefined): void {
        const currentItems = this.listItems();
        this.listItems.set(currentItems.filter(item => item.id !== bookId))
    }

    clearList(): void{
        this.listItems.set([]);
    }

    getItemCount(): number{
        return this.listItems().length;
    }

}