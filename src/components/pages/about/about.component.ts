import { Component } from "@angular/core";
import { HeaderComponent } from "../../../app/shared/header/header.component.js";

@Component({
    selector: 'app-about-component',
    standalone: true,
    imports: [HeaderComponent],
    templateUrl: './about.component.html',
    styleUrl: './about.component.css'
  })
  export class AboutComponent { }