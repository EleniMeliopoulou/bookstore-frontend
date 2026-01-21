import { Component, OnInit, computed, inject, signal } from "@angular/core";
import { BookService } from "../../../services/book.service.js";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { Books } from "../../../interfaces/interfaces.js";
import { HeaderComponent } from "../../../app/shared/header/header.component.js";
import { CommonModule } from "@angular/common";
import { CartService } from "../../../services/cart.service.js";
import Swal from "sweetalert2";
import { BookListService } from "../../../services/booklist.service.js";

@Component({
    selector: 'app-bookInfo-component',
    standalone: true,
    imports: [HeaderComponent, CommonModule, RouterLink],
    templateUrl: './bookInfo.component.html',
    styleUrl: './bookInfo.component.css'
})
export class BookInfoComponent implements OnInit{
    //Injects
    bookService = inject(BookService)
    private route = inject(ActivatedRoute);
    cartService = inject(CartService);
    bookListService = inject(BookListService);

    //Signals
    bookData = signal<Books | null>(null);
    error = signal<string | null>(null);
    isLiked = signal<boolean>(false);

    //Computed Signals
    book = computed(() => this.bookData());
    title = computed(() => this.bookData()?.title ?? 'No title');
    image = computed(() => this.bookData()?.image ?? 'No image');
    author = computed(() => this.bookData()?.author ?? 'No author');
    description = computed(() => this.bookData()?.description ?? 'No description');
    genre = computed(() => this.bookData()?.genre ?? 'No genre');
    publishedDate = computed(() => this.bookData()?.publishedDate ?? 'No publishedDate');
    rating = computed(() => this.bookData()?.rating ?? 'No rating');

    ngOnInit(): void {
      this.route.paramMap.subscribe(params => { const id = params.get('id');
        if (id) {
            this.showInfo(Number(id));
        } else {
            this.error.set('Δεν βρέθηκε ID βιβλίου');
        }
      });
    }

    showInfo(id: number){
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
        console.log('Adding to list:', book);
        this.isLiked.update(liked => !liked)
        if(this.isLiked()){
          this.bookListService.addItem(book);
          Swal.fire({
            position: "bottom-right",
            icon: "success",
            title: `Added To List`,
            showConfirmButton: false,
            timer: 2000,
            width: 400,
          });
        }else {
          this.bookListService.removeItem(book.id);
          Swal.fire({
            position: "bottom-right",
            icon: "error",
            title: `Remove From List`,
            showConfirmButton: false,
            timer: 2000,
            width: 400,
          });
        }
       
      }

}