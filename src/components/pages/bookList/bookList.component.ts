import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { HeaderComponent } from "../../../app/shared/header/header.component.js";
import { CartService } from "../../../services/cart.service.js";
import { RouterLink } from "@angular/router";
import { BookListService } from "../../../services/booklist.service.js";

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

    bookListItems = this.bookListService.getListItems;

    removeFromList(bookId: number | undefined): void {
        this.bookListService.removeItem(bookId);
    }

    clearList():void{
        this.bookListService.clearList();
    }

  }