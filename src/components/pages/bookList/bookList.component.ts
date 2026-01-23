import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { HeaderComponent } from "../../../app/shared/header/header.component.js";
import * as LikedBooksActions from '../../../ngrx/liked-books/liked-books.actions.js';
import { RouterLink } from "@angular/router";
import { BookListService } from "../../../services/booklist.service.js";
import { Store } from "@ngrx/store";

@Component({
    selector: 'app-bookList-component',
    standalone: true,
    imports: [CommonModule,HeaderComponent,RouterLink],
    templateUrl: './bookList.component.html',
    styleUrl: './bookList.component.css'
  })
  export class BookListComponent { 
    //Injects
    bookListService = inject(BookListService);
    store = inject(Store);

    bookListItems = this.bookListService.getListItems;
    userId = 1;

    removeFromList(bookId: number | undefined): void {
        this.bookListService.removeItem(bookId);
        this.store.dispatch(LikedBooksActions.toggleLike({
          userId: this.userId,
          bookId: bookId!
        }));
    }

    clearList():void{
        this.bookListService.clearList();
    }

  }