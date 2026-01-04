import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgbModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  router = inject(Router);

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
