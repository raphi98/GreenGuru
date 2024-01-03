import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-user-registration',
  templateUrl: './user-registration.component.html',
  styleUrls: ['./user-registration.component.scss']
})
export class UserRegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      repeatPassword: ['', Validators.required]
    }, { validators: this.passwordMatchingValidator });
  }

  private passwordMatchingValidator(control: FormGroup): ValidationErrors | null {
    const password = control.get('password')?.value;
    const repeatPassword = control.get('repeatPassword')?.value;
    return password === repeatPassword ? null : { passwordsNotMatching: true };
  }

  onSubmit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registrationForm.valid) {
      this.authService.register({
        username: this.registrationForm.value.username,
        email: this.registrationForm.value.email,
        password: this.registrationForm.value.password
      }).subscribe({
        next: () => {
          this.successMessage = 'User registered successfully!';
          this.registrationForm.reset();
          this.router.navigate(['/login']);
        },
        error: (error: any) => {
          this.errorMessage = error.error.message || 'An error occurred during registration. Please try again.';
        }
      });
    } else {
      this.errorMessage = 'Please fill out the form correctly.';
    }
  }
}
