import { Routes } from '@angular/router';
import { LoginSignUp } from '../components/loginSignUp/loginSignUp.component.js';
import { HomeComponent } from '../components/pages/home/home.component.js';
import { AboutComponent } from '../components/pages/about/about.component.js';
import { ContactComponent } from '../components/pages/contact/contact.component.js';
import { ForgotPasswordComponent } from '../components/pages/forgot-password/forgotPassword.component.js';

export const routes: Routes = [
    { path: '', component: LoginSignUp },
    { path: 'home', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'contact', component: ContactComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
];
