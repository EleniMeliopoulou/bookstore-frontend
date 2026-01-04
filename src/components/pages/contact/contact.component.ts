import { Component } from "@angular/core";
import { HeaderComponent } from "../../../app/shared/header/header.component.js";

@Component({
    selector: 'app-contact-component',
    standalone: true,
    imports: [HeaderComponent],
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.css'
  })
  export class ContactComponent { }