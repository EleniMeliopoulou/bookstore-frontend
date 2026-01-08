import { Component, OnInit, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { UserService } from "../../../services/user.service.js";
import Swal from 'sweetalert2';
import { Router } from "@angular/router";

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './forgotPassword.component.html',
    styleUrl: './forgotPassword.component.css'
})
export class ForgotPasswordComponent implements OnInit {
    message = signal('');

    fb = inject(FormBuilder);
    userProfile = inject(UserService);
    router = inject(Router);

    forgotPasswordForm!: FormGroup;

    ngOnInit(): void {
        this.forgotPasswordForm = this.fb.group({ email: ['', [Validators.required, Validators.email]] })
    }


    public forgotPasswordModal() {
        this.forgotPasswordForm.markAllAsTouched();
        this.forgotPasswordForm.get('email')?.markAsDirty();
        document.querySelector('.forgot-password-form')?.classList.add('submitted');

        if (this.forgotPasswordForm.invalid) return;

        const emailValue = this.forgotPasswordForm.get('email')?.value;
        if (!emailValue) return;

        this.userProfile.getUser(emailValue).subscribe({
            next: () => {
                this.message.set('');
                Swal.fire({
                    draggable: true,
                    showCloseButton: true,
                    title: 'Change Password',
                    color: "#FF8526",
                    backdrop: ` rgba(0,0,123,0.4) 
                                url("/assets/character.png") 
                                left top / 200px 200px 
                                no-repeat `,
                    html:
                        ` <input type="password" id="password" class="swal2-input" placeholder="Password"> 
                    <input type="password" id="confirm" class="swal2-input" placeholder="Confirm Password"> `,
                    showCancelButton: true,
                    confirmButtonColor: "#FF9100",
                    cancelButtonColor: "#D44000",
                    cancelButtonText: 'Cancel',
                    confirmButtonText: 'Change',

                    preConfirm: () => {
                        const password = (document.getElementById('password') as HTMLInputElement).value;
                        const confirm = (document.getElementById('confirm') as HTMLInputElement).value;

                        if (!password || !confirm) {
                            Swal.showValidationMessage("Invalid password.");
                            return false;
                        }
                        if (password !== confirm) {
                            Swal.showValidationMessage("Passwords do not match.");
                            return false;
                        }

                        // Return a promise so SweetAlert waits for the HTTP call 
                        return this.userProfile.changePassword(emailValue, password).toPromise();
                    }
                }).then((result) => {

                    if (!result.isConfirmed) return;

                    Swal.fire({
                        position: "bottom-right",
                        icon: "success",
                        title: "Your password has changed successfully",
                        showConfirmButton: false,
                        timer: 3000,
                        width: 400,
                    });

                    setTimeout(() => {
                        this.router.navigate(['']);
                    }, 3500);
                });

            },
            error: () => { this.message.set("The email is invalid. Try again"); }
        });
    }

}
