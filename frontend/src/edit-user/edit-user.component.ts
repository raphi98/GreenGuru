import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
    editForm: FormGroup;
    userId: number | null = null;
    username: string = '';

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.editForm = this.formBuilder.group({
            username: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            newPassword: ['', [Validators.minLength(4)]],
            repeatPassword: ['']
        });
    }

    ngOnInit(): void {
        this.userId = this.authService.getUserIdFromToken();
        this.username = this.authService.getUsernameFromToken();
        this.editForm.get('username')?.setValue(this.username);

        if (this.userId !== null) {
            this.loadUserDetails(this.userId);
        }
    }

    loadUserDetails(userId: number): void {
        this.authService.getUserDetails(userId).subscribe(
            userDetails => {
                this.username = userDetails.username;
                this.editForm.patchValue({
                    email: userDetails.email,
                    username: userDetails.username
                });
            },
            error => {
                console.error('Error loading user details', error);
            }
        );
    }

    onSave(): void {
        if (this.editForm.invalid) {
            return;
        }

        if (this.userId === null) {
            alert('User ID is not available.');
            return;
        }

        const formData = this.editForm.value;

        if (formData.newPassword && formData.newPassword !== formData.repeatPassword) {
            alert('New Password does not match with Repeat New Password');
            return;
        }

        const updateData = {
          username: formData.username, email: formData.email
        };

        this.authService.updateUserDetails(this.userId, updateData).subscribe({
            next: () => {
                if (formData.newPassword) {
                    this.authService.updatePassword(this.userId as number, formData.newPassword, formData.repeatPassword).subscribe({
                        next: () => {
                            alert('User details and password updated successfully');
                            this.router.navigate(['/dashboard']);
                        },
                        error: err => {
                            console.error('Error updating password', err);
                            alert('There was an error updating the password: ' + err);
                        }
                    });
                } else {
                    alert('User details updated successfully');
                    this.router.navigate(['/dashboard']);
                }
            },
            error: err => {
                console.error('Error updating user details', err);
                alert('There was an error updating user details: ' + err);
            }
        });
    }
    onCancel(): void {
        this.router.navigate(['/dashboard']);
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
}
