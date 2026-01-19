import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { selectUser, selectUsername } from '../../../ngrx/login-page.reducer.js';
import { AsyncPipe } from '@angular/common';
import Swal from 'sweetalert2';
import { UserService } from '../../../services/user.service.js';
import { combineLatest, map, take } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { updateUsername } from '../../../ngrx/login-page.actions.js';
import { CartService } from '../../../services/cart.service.js';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgbModule, RouterLink,RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {

  //Injects
  store = inject(Store);
  userProfile = inject(UserService);
  cartService = inject(CartService);
    
  cartItemCount = this.cartService.getCartItems;

  username$ = this.store.select(selectUsername);
  email$ = this.store.select(selectUser).pipe(map(u => u?.email));

  public profileModal() {
    combineLatest([this.username$, this.email$]).pipe(take(1)).subscribe(([username, email]) => {
      Swal.fire({
        draggable: true,
        showCloseButton: true,
        title: 'User Profile',
        color: "#FF8526",
        backdrop: ` rgba(0,0,123,0.4)  `,
        html:
          ` <div style="display: flex; flex-direction: row; align-items:center; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="#6a6868" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-user-icon lucide-user">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
            </svg> 
            <input type="text" id="username" class="swal2-input" placeholder="Username" value="${username}"> 
          </div>
          <div style="display: flex; flex-direction: row; align-items:center; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="#6a6868" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="lucide lucide-at-sign-icon lucide-at-sign">
            <circle cx="12" cy="12" r="4" />
            <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
            </svg>
            <input type="text" id="email" class="swal2-input" placeholder="Email" value="${email}" disabled style="cursor: not-allowed; 
            background: #f3f3f3;">
          </div>
          `,
        showCancelButton: true,
        confirmButtonColor: "#FF9100",
        cancelButtonColor: "#D44000",
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Save',

        preConfirm: () => {
          const username = (document.getElementById('username') as HTMLInputElement).value;

          if (!username) {
            Swal.showValidationMessage("Invalid value.");
            return false;
          }

          return firstValueFrom(this.userProfile.updateUser(email!, username))
            .catch(err => {
              Swal.showValidationMessage("Update failed.");
              throw err;
            });
        }
      }).then((result) => {

        const username = (document.getElementById('username') as HTMLInputElement).value;

        this.store.dispatch(updateUsername({ email: email!, username }))

        if (!result.isConfirmed) return;

        Swal.fire({
          position: "bottom-right",
          icon: "success",
          title: "Changes saved successfully",
          showConfirmButton: false,
          timer: 1500,
          width: 300,

        });
      });
    })
  }

}
