import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { HeaderComponent } from "../../../app/shared/header/header.component.js";

@Component({
    selector: 'app-home-component',
    standalone: true,
    imports: [HeaderComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
  })
  export class HomeComponent { 
    router = inject(Router);

    public logout(){
      this.router.navigate(['']);
    }

    public homePage(){
      this.router.navigate(['/home']);
    }

    public bookListPage(){
      this.router.navigate(['/booklist'])
    }

    public aboutPage(){
      this.router.navigate(['/about'])
    }

    public contactPage(){
      this.router.navigate(['/contact'])
    }
  }

