import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRegistrationComponent } from '../user-registration/user-registration.component';
import { UserLoginComponent } from '../user-login/user-login.component';
import {LandingPageComponent} from "../landing-page/landing-page.component";

const routes: Routes = [
  { path: 'register', component: UserRegistrationComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'landing-page', component: LandingPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
