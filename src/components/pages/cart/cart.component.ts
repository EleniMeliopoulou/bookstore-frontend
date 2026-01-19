import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { HeaderComponent } from "../../../app/shared/header/header.component.js";
import { CartService } from "../../../services/cart.service.js";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-cart-component',
    standalone: true,
    imports: [CommonModule,HeaderComponent,RouterLink],
    templateUrl: './cart.component.html',
    styleUrl: './cart.component.css'
  })
  export class CartComponent { 
    //Injects
    cartService = inject(CartService);

    cartItems = this.cartService.getCartItems;

    removeFromCart(bookId: number | undefined): void {
        this.cartService.removeItem(bookId);
    }

    clearCart():void{
        this.cartService.clearCart();
    }

  }