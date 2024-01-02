import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service'; // Import AuthService

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})
export class UserRegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private formBuilder: FormBuilder, private authService: AuthService) { } // Use AuthService

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required]
    }, { validators: this.passwordMatchingValidator });
  }

  private passwordMatchingValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const repeatPassword = control.get('repeatPassword')?.value;
    return password === repeatPassword ? null : { passwordsNotMatching: true };
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      this.registerUser();
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
      this.successMessage = '';
    }
  }

  private registerUser() {
    const user = {
      username: this.registrationForm.value.username,
      email: this.registrationForm.value.email,
      password: this.registrationForm.value.password
    };

    this.authService.register(user).subscribe({
      next: (response) => {
        this.successMessage = 'User registered successfully!';
        this.registrationForm.reset();
        this.errorMessage = '';
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'An error occurred during registration.';
        this.successMessage = '';
      }
    });
  }
}
