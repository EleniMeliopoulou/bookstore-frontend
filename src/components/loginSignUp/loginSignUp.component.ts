import { Component, OnInit, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from "../../services/user.service.js";
import { HttpErrorResponse } from '@angular/common/http';
import { UserProfile } from "../../interfaces/interfaces.js";
import { Router } from '@angular/router';
import { login } from "../../ngrx/login-page.actions.js";
import { Store } from "@ngrx/store";

@Component({
  selector: 'app-login-signup',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './loginSignUp.component.html',
  styleUrl: './loginSignUp.component.css'
})
export class LoginSignUp implements OnInit {
  //Signals
  header = signal("Login");
  isLogin = signal(true);
  isSignUp = signal(false);
  message = signal('');

  //Injects
  userProfile = inject(UserService);
  fb = inject(FormBuilder);
  router = inject(Router);
  store = inject(Store);

  signUpForm!: FormGroup;
  loginForm!: FormGroup;

  ngOnInit() {
    this.signUpForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  public showLogin() {
    this.isLogin.set(true);
    this.isSignUp.set(false);
    this.header.set("Login");
    this.message.set('');
    this.signUpForm.reset();
  }

  public showSignUp() {
    this.isLogin.set(false);
    this.isSignUp.set(true);
    this.header.set("SignUp");
    this.message.set('');
    this.loginForm.reset();
  }

  public forgotPasswordModal() {
    this.router.navigate(['/forgot-password']);
  }

  public userLogin() {
    this.loginForm.markAllAsTouched();
    this.loginForm.get('email')?.markAsDirty();
    this.loginForm.get('password')?.markAsDirty();
    document.querySelector('.login-form')?.classList.add('submitted');

    if (this.loginForm.invalid) return;

    const emailValue = this.loginForm.get('email')?.value;
    if (!emailValue) return;
    const password = this.loginForm.get('password')?.value;
    if(!password) return;

    this.store.dispatch(login({ email: emailValue, password: password }));

    this.userProfile.getUser(emailValue).subscribe({
      next: (user) => {
        console.log("User found:", user);
        this.loginForm.reset();
        this.router.navigate(['/home']);
      },
      error: (err: HttpErrorResponse) => {
        this.message.set("User not found. Please sign up first");
      }
    });
  }

  public userSignUp() {
    if (this.signUpForm.invalid) {
      this.signUpForm.markAllAsTouched();
      this.message.set("Please fill all fields");
      return;
    }

    this.signUpForm.markAllAsTouched();
    this.signUpForm.get('username')?.markAsDirty();
    this.signUpForm.get('email')?.markAsDirty();
    this.signUpForm.get('password')?.markAsDirty();
    document.querySelector('.signUp-form')?.classList.add('submitted');

    const newUser: UserProfile = this.signUpForm.value;

    this.userProfile.createUser(newUser).subscribe({
      next: (user) => {
        console.log("User created:", user);
        this.signUpForm.reset();
        this.message.set("User created successfully. Please login in");
      },
      error: (err: HttpErrorResponse) => {
        this.message.set("User creation failed. Please try again");
      }
    });
  }
}