import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserRegistrationComponent } from '../user-registration/user-registration.component';
import { UserLoginComponent } from '../user-login/user-login.component';
import { MainDashboardComponent } from '../main-dashboard/main-dashboard.component';
import { AddPlantComponent } from '../add-plant/add-plant.component';
import { EditPlantComponent } from '../edit-plant/edit-plant.component'
import { AuthGuard } from '../services/auth.guard';
import {LandingPageComponent} from "../landing-page/landing-page.component";
import {EncyclopediaPageComponent} from "../encyclopedia-page/encyclopedia-page.component";
import {EditUserComponent} from "../edit-user/edit-user.component";
import {AdminComponent} from "../admin/admin.component";

import {FriendsDashboardComponent} from "../friends-dashboard/friends-dashboard.component";
const routes: Routes = [
  { path: 'register', component: UserRegistrationComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'landing-page', component: LandingPageComponent },
  { path: 'encyclopedia-page', component: EncyclopediaPageComponent },
  { path: 'dashboard', component: MainDashboardComponent, canActivate: [AuthGuard] },
  { path: 'add-plant', component: AddPlantComponent, canActivate: [AuthGuard] },
  { path: 'edit-plant', component: EditPlantComponent, canActivate: [AuthGuard] },
  { path: 'edit-plant/:id', component: EditPlantComponent, canActivate: [AuthGuard] },
  { path: 'friends', component: FriendsDashboardComponent, canActivate: [AuthGuard] },
  { path: 'edit-user', component: EditUserComponent, canActivate: [AuthGuard] },
  { path: 'edit-user/:id', component: EditUserComponent, canActivate: [AuthGuard] },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { expectedRole: 'admin' }
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
