import { Component, OnInit, inject, signal } from "@angular/core";
import { HeaderComponent } from "../../../app/shared/header/header.component.js";
import { BookService } from "../../../services/book.service.js";
import { map } from "rxjs";
import { Books } from "../../../interfaces/interfaces.js";
import { CommonModule } from "@angular/common";
import { CartService } from "../../../services/cart.service.js";
import Swal from "sweetalert2";
import { RouterLink } from "@angular/router";

interface GenreCarousel {
  genre: string;
  bookChunks: Books[][];
}

@Component({
    selector: 'app-home-component',
    standalone: true,
    imports: [HeaderComponent,CommonModule,RouterLink],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
  })
  export class HomeComponent implements OnInit{ 
    //Injects
    bookService = inject(BookService);
    cartService = inject(CartService);
    
    allGenreCarousels = signal<GenreCarousel[]>([]);
    displayedCarousels = signal<GenreCarousel[]>([]);
    
    currentPage = signal(1);
    carouselsPerPage = 20;
    totalPages = signal(0);
    
    isLoading = signal(true);
    error = signal<string | null>(null);

    ngOnInit(): void {
      console.log('ngOnInit called');
        this.showBooks();
    }

    showBooks() {
      this.isLoading.set(true);
      
      this.bookService.getBooks().subscribe({
        next: (books) => {
          const genreMap = new Map<string, Books[]>();
          
          books
            .filter(book => book.image && book.genre)
            .forEach(book => {
              const genre = book.genre!;
              if (!genreMap.has(genre)) {
                genreMap.set(genre, []);
              }
              genreMap.get(genre)!.push({
                id: book.id,
                author: book.author,
                description: book.description,
                image: book.image,
                publishedDate: book.publishedDate,
                rating: book.rating,
                title: book.title,
              });
            });
          const carousels = Array.from(genreMap.entries()).map(([genre, books]) => ({
            genre,
            bookChunks: this.chunkArray(books, 6)
          }));
          
          this.allGenreCarousels.set(carousels);
          this.totalPages.set(Math.ceil(carousels.length / this.carouselsPerPage));
          this.updateDisplayedCarousels();
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error loading books:', err);
          this.error.set('Error loading books');
          this.isLoading.set(false);
        }
      });
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

    updateDisplayedCarousels() {
      const startIndex = (this.currentPage() - 1) * this.carouselsPerPage;
      const endIndex = startIndex + this.carouselsPerPage;
      this.displayedCarousels.set(this.allGenreCarousels().slice(startIndex, endIndex));
    }
    
    goToPage(page: number) {
      if (page >= 1 && page <= this.totalPages()) {
        this.currentPage.set(page);
        this.updateDisplayedCarousels();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    
    nextPage() {
      this.goToPage(this.currentPage() + 1);
    }
    
    previousPage() {
      this.goToPage(this.currentPage() - 1);
    }
    
    getPageNumbers(): number[] {
      const pages: number[] = [];
      const maxVisiblePages = 5;
      
      let startPage = Math.max(1, this.currentPage() - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(this.totalPages(), startPage + maxVisiblePages - 1);
      
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      return pages;
    }

    chunkArray<T>(array: T[], size: number): T[][] {
      const chunks: T[][] = [];
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
      }
      return chunks;
    }
    
    getCarouselId(genre: string): string {
      return `carousel-${genre.replace(/\s+/g, '-').toLowerCase()}`;
    }

  }


