import { CommonModule } from "@angular/common";
import { Component, OnInit, inject } from "@angular/core";
import { HeaderComponent } from "../../../app/shared/header/header.component.js";
import { CartService } from "../../../services/cart.service.js";
import { RouterLink } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-cart-component',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterLink],
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

  clearCart(): void {
    this.cartService.clearCart();
  }

  placeOrder(): void {
    Swal.fire({
      title: "Are you sure you want to proceed with your order?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      backdrop: ` rgba(0,0,123,0.4)  `
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Confirmed Order!",
          text: "Your order has successfully been placed.",
          icon: "success",
          backdrop: ` rgba(0,0,123,0.4)  `
        });
        this.cartService.clearCart();
      }
    })

  }
}