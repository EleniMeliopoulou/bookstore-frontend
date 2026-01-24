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
import { selectIsBookLiked, selectLoading } from "../../../ngrx/liked-books/liked-books.reducer.js";
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
  private store = inject(Store);
  bookService = inject(BookService)
  private route = inject(ActivatedRoute);
  cartService = inject(CartService);
  bookListService = inject(BookListService);
  actions$ = inject(Actions);

  //Signals
  bookData = signal<Books | null>(null);
  error = signal<string | null>(null);
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
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.bookId.set(Number(id));
        this.isLiked$ = this.store.select(selectIsBookLiked(Number(id)));
        this.showInfo(Number(id));
      } else {
        this.error.set('Δεν βρέθηκε ID βιβλίου');
      }
    });
  }

  showInfo(id: number) {
    this.bookService.getBook(id).subscribe({
      next: (book) => {
        console.log(book);
        this.bookData.set(book);
      },
      error: (err) => {
        console.error('Error finding book:', err);
        this.error.set('Error finding book');
      }
    })
  }

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
            this.bookListService.removeItem(book.id);
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