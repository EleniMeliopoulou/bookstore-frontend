import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { HeaderComponent } from "../../../app/shared/header/header.component.js";
import * as LikedBooksActions from '../../../ngrx/liked-books/liked-books.actions.js';
import { RouterLink } from "@angular/router";
import { BookListService } from "../../../services/booklist.service.js";
import { Store } from "@ngrx/store";
import { selectUserId } from "../../../ngrx/login-page/login-page.reducer.js";
import { selectLikedBooks } from "../../../ngrx/liked-books/liked-books.selectors.js";
import { take } from "rxjs";
import { Actions, ofType } from "@ngrx/effects";
import Swal from "sweetalert2";

@Component({
  selector: 'app-bookList-component',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterLink],
  templateUrl: './bookList.component.html',
  styleUrl: './bookList.component.css'
})
export class BookListComponent {
  //Injects
  bookListService = inject(BookListService);
  store = inject(Store);
  actions$ = inject(Actions);

  userId$ = this.store.select(selectUserId);
  likedBooks$ = this.store.select(selectLikedBooks);

  items = this.bookListService.getListItems;

  ngOnInit(): void {
    this.userId$.pipe(take(1)).subscribe(userId => {
      if (userId) {
        this.store.dispatch(LikedBooksActions.loadLikedBooks({ userId }));
      }
    });

    //Load liked books from state
    this.likedBooks$.subscribe(likedBooks => {
      console.log('Liked books updated:', likedBooks);
      this.bookListService.syncWithStore(likedBooks);
    });
  }

  /**
   * Remove book from list and update state
   * @param bookId 
   * @returns 
   */
  removeFromList(bookId: number): void {
    if (!bookId) return;

    this.userId$.pipe(take(1)).subscribe(userId => {
      if (!userId) return;

      this.store.dispatch(LikedBooksActions.toggleLike({ userId, bookId }));

      this.actions$.pipe(
        ofType(LikedBooksActions.toggleLikeSuccess),
        take(1)
      ).subscribe(({ isLiked }) => {
        if (!isLiked) {
          Swal.fire({
            position: "bottom-right",
            icon: "error",
            title: `Removed From List`,
            showConfirmButton: false,
            timer: 2000,
            width: 400,
          });
        }
      });
    });
  }

}