import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRegistrationComponent } from '../user-registration/user-registration.component';
import { UserLoginComponent } from '../user-login/user-login.component';
import {MainDashboardComponent } from '../main-dashboard/main-dashboard.component';
import { AuthGuard } from '../services/auth.guard';
import {EditPlantComponent} from "../edit-plant/edit-plant.component";

const routes: Routes = [
  { path: 'register', component: UserRegistrationComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'dashboard', component: MainDashboardComponent, canActivate: [AuthGuard] },
  { path: 'edit-plant', component: EditPlantComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
