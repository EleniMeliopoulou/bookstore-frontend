import { Routes } from '@angular/router';
import { LoginSignUp } from '../components/loginSignUp/loginSignUp.component.js';
import { HomeComponent } from '../components/pages/home/home.component.js';
import { ForgotPasswordComponent } from '../components/pages/forgot-password/forgotPassword.component.js';
import { CartComponent } from '../components/pages/cart/cart.component.js';
import { BookInfoComponent } from '../components/pages/book-Info/bookInfo.component.js';
import { BookListComponent } from '../components/pages/bookList/bookList.component.js';

export const routes: Routes = [
    { path: '', component: LoginSignUp },
    { path: 'home', component: HomeComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'cart', component: CartComponent },
    { path: 'booklist', component: BookListComponent },
    { path: 'book-info/:id', component: BookInfoComponent },

];
