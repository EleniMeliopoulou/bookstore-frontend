import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { selectUsername } from '../../../ngrx/login-page.reducer.js';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgbModule,AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  router = inject(Router);
  store = inject(Store);

  username$ = this.store.select(selectUsername);

  public logout() {
    this.router.navigate(['']);
  }

  public homePage() {
    this.router.navigate(['/home']);
  }

  public bookListPage() {
    this.router.navigate(['/booklist']);
  }

  public aboutPage() {
    this.router.navigate(['/about']);
  }

  public contactPage() {
    this.router.navigate(['/contact']);
  }
}
