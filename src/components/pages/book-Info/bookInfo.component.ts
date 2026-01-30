import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { BookService } from "../../../services/book.service.js";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Books } from "../../../interfaces/interfaces.js";
import { HeaderComponent } from "../../../app/shared/header/header.component.js";
import { CommonModule } from "@angular/common";
import { CartService } from "../../../services/cart.service.js";
import Swal from "sweetalert2";
import { BookListService } from "../../../services/booklist.service.js";
import { Store } from "@ngrx/store";
import { selectIsBookLiked, selectLoading } from "../../../ngrx/liked-books/liked-books.selectors.js";
import * as LikedBooksActions from '../../../ngrx/liked-books/liked-books.actions.js';
import { Observable, take } from "rxjs";
import { selectUserId } from "../../../ngrx/login-page/login-page.reducer.js";
import { Actions, ofType } from "@ngrx/effects";

@Component({
  selector: 'app-bookInfo-component',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterLink],
  templateUrl: './bookInfo.component.html',
  styleUrl: './bookInfo.component.css'
})
export class BookInfoComponent implements OnInit {
  //Injects
  store = inject(Store);
  bookService = inject(BookService)
  route = inject(ActivatedRoute);
  cartService = inject(CartService);
  bookListService = inject(BookListService);
  actions$ = inject(Actions);

  //Signals
  bookData = signal<Books | null>(null);
  bookId = signal<number>(0);

  //Computed Signals
  book = computed(() => this.bookData());
  title = computed(() => this.bookData()?.title ?? 'No title');
  image = computed(() => this.bookData()?.image ?? 'assets/default.jpg');
  author = computed(() => this.bookData()?.author ?? 'No author');
  description = computed(() => this.bookData()?.description ?? 'No description');
  genre = computed(() => this.bookData()?.genre ?? 'No genre');
  publishedDate = computed(() => this.bookData()?.publishedDate ?? 'No publishedDate');
  rating = computed(() => this.bookData()?.rating ?? 'No rating');

  // NgRx Selectors
  isLiked$!: Observable<boolean>;
  isLoadingLike$ = this.store.select(selectLoading);
  userId$ = this.store.select(selectUserId);

  ngOnInit(): void {
    this.userId$.pipe(
      take(1)).subscribe(userId => {
        if (userId) {
          this.store.dispatch(LikedBooksActions.loadLikedBooks({ userId }));
        }
      });
    //Take book id from URL (book-info/:id)
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.bookId.set(Number(id));
        this.isLiked$ = this.store.select(selectIsBookLiked(Number(id)));
        this.showInfo(Number(id));
      } else {
        console.log('No book with this ID found');
      }
    });
  }

  /**
   * Show the book info
   * @param id 
   */
  showInfo(id: number) {
    this.bookService.getBook(id).subscribe({
      next: (book) => {
        console.log(book);
        this.bookData.set(book);
      },
      error: (err) => {
        console.error('Error finding book:', err);
      }
    })
  }

  /**
   * Add the book to the cart
   * @param book 
   */
  addToCart(book: Books) {
    console.log('Adding to cart:', book);
    this.cartService.addItem(book);
    Swal.fire({
      position: "bottom-right",
      icon: "success",
      title: `Added To Cart`,
      showConfirmButton: false,
      timer: 2000,
      width: 400,
    });
  }

  /**
   * Add the book to the liked books list
   * @param book 
   */
  addToBookList(book: Books) {
    this.userId$.pipe(
      take(1)).subscribe(userId => {
        if (!userId || !book.id) return;

        this.store.dispatch(LikedBooksActions.toggleLike({ userId, bookId: book.id }));

        this.actions$.pipe(
          ofType(LikedBooksActions.toggleLikeSuccess),
          take(1)
        ).subscribe(({ isLiked }) => {
          if (isLiked) {
            this.bookListService.addItem(book);
            Swal.fire({
              position: "bottom-right",
              icon: "success",
              title: `Added To List`,
              showConfirmButton: false,
              timer: 2000,
              width: 400,
            });
          } else {
            this.bookListService.removeItem(book.id!);
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