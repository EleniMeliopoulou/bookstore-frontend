import { Component, ElementRef, HostListener, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { selectUser, selectUsername } from '../../../ngrx/login-page/login-page.reducer.js';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { UserService } from '../../../services/user.service.js';
import { Subject, combineLatest, debounceTime, map, take } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { updateUsername } from '../../../ngrx/login-page/login-page.actions.js';
import { CartService } from '../../../services/cart.service.js';
import { BookService } from '../../../services/book.service.js';
import { Books } from '../../../interfaces/interfaces.js';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgbModule, RouterLink, RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  //Injects
  store = inject(Store);
  userService = inject(UserService);
  cartService = inject(CartService);
  bookService = inject(BookService);
  elementRef = inject(ElementRef);
  router = inject(Router);

  //Signals
  searchInput = signal<string>('');
  searchResults = signal<Books[]>([]);

  private searchSubject = new Subject<string>();

  cartItemCount = this.cartService.getCartItems;

  username$ = this.store.select(selectUsername);
  email$ = this.store.select(selectUser).pipe(map(u => u?.email));

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(1000)
    ).subscribe(searchTerm => this.fetchSearchResults(searchTerm))
  }

  /**
   * Update user profile modal (the user can change their username)
   */
  public profileModal() {
    combineLatest([this.username$, this.email$]).pipe(take(1)).subscribe(([username, email]) => {
      console.log('Modal data:', username, email);
      Swal.fire({
        showCloseButton: true,
        title: 'User Profile',
        backdrop: ` rgba(0,0,123,0.4)  `,
        html:
          ` <div style="display: flex; flex-direction: row; align-items:center; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="#6a6868" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-user-icon lucide-user">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
            </svg> 
            <input type="text" id="username" class="swal2-input" placeholder="Username" value="${username}"> 
          </div>
          <div style="display: flex; flex-direction: row; align-items:center; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="#6a6868" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-at-sign-icon lucide-at-sign">
            <circle cx="12" cy="12" r="4" />
            <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
            </svg>
            <input type="text" id="email" class="swal2-input" placeholder="Email" value="${email}" disabled style="cursor: not-allowed; 
            background: #f3f3f3;">
          </div>
          `,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Save',

        preConfirm: () => {
          const username = (document.getElementById('username') as HTMLInputElement).value;

          if (!username) {
            Swal.showValidationMessage("Invalid value.");
            return false;
          }

          return firstValueFrom(this.userService.updateUser(email!, username))
            .catch(err => {
              Swal.showValidationMessage("Update failed.");
              throw err;
            });
        }
      }).then((result) => {

        const username = (document.getElementById('username') as HTMLInputElement).value;

        this.store.dispatch(updateUsername({ email: email!, username }))

        if (!result.isConfirmed) return;

        Swal.fire({
          position: "bottom-right",
          icon: "success",
          title: "Changes saved successfully",
          showConfirmButton: false,
          timer: 1500,
          width: 300,

        });
      });
    })
  }

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.searchInput.set(value);

    if (value.trim() !== "") {
      this.searchSubject.next(value);
    } else {
      this.searchResults.set([]);
    }
  }

  /**
   * Fetch books according to the search input
   * @param searchTerm 
   */
  fetchSearchResults(searchTerm: string) {
    this.bookService.searchBooks(searchTerm).subscribe({
      next: (books) => {
        this.searchResults.set(books.slice(0, 5));
      },
      error: () =>
        this.searchResults.set([])
    });
  }

  /**
   * Search icon functionallity (the user navigates to the first book info page)
   */
  handleSearchClick() {
    const trimmedInput = this.searchInput().trim();

    if (trimmedInput && this.searchInput().length > 0) {
      const firstBook = this.searchResults()[0];
      if (firstBook.id) {
        this.router.navigate(['/book-info', firstBook.id]);
        this.searchResults.set([]);
        this.searchInput.set('');
      }
    }
  }

  /**
   * The user selectes the book he wants from the dropdown and navigates to the book info page
   * @param book 
   */
  selectBook(book: Books) {
    if (book.id) {
      this.router.navigate(['/book-info', book.id]);
      this.searchInput.set('');
      this.searchResults.set([]);
    }
  }

  /**
   * Fallback for the image
   * @param book 
   * @returns 
   */
  getImageUrl(book: Books): string {
    if (!book.image || book.image.trim() === "" || book.image === "null") {
      return "/assets/default.jpg";
    }
    return book.image;
  }

  /**
   * Slicing of book titles
   * @param title 
   * @param maxLength 
   * @returns 
   */
  truncateTitle(title: string | undefined, maxLength: number = 50): string {
    if (!title) return '';
    return title.length > maxLength ? title.slice(0, maxLength) + "..." : title;
  }

  /**
   * Close dropdown when clicking outside
   * @param event 
   */
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.searchResults.set([]);
    }
  }

}
