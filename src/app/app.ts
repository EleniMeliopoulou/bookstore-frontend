import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginSignUp } from '../components/loginSignUp/loginSignUp.component.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,LoginSignUp],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend-angular');
}
