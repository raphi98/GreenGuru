import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { UserRegistrationComponent } from '../user-registration/user-registration.component';
import { UserLoginComponent } from '../user-login/user-login.component';
import { MainDashboardComponent } from '../main-dashboard/main-dashboard.component';
import { AddPlantComponent } from '../add-plant/add-plant.component'
import { EditPlantComponent } from '../edit-plant/edit-plant.component'
import { SafeUrlPipe } from '../services/safeUrl.pipe'

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LandingPageComponent } from '../landing-page/landing-page.component';
import { EncyclopediaPageComponent } from '../encyclopedia-page/encyclopedia-page.component';
import { EncyclopediaComponentComponent } from '../encyclopedia-component/encyclopedia-component.component';
import { EncyclopediaDialogComponent } from '../encyclopedia-dialog/encyclopedia-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import { PlantCardComponent } from '../plant-card/plant-card.component';
import { MenuBarComponent } from '../menu-bar/menu-bar.component';
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatTooltipModule} from "@angular/material/tooltip";

@NgModule({
  declarations: [
    AppComponent,
    UserRegistrationComponent,
    UserLoginComponent,
    LandingPageComponent,
    EncyclopediaPageComponent,
    EncyclopediaComponentComponent,
    EncyclopediaDialogComponent,
    MainDashboardComponent,
    AddPlantComponent,
    EditPlantComponent,
    SafeUrlPipe,
    PlantCardComponent,
    MenuBarComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        MatCardModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        ReactiveFormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FormsModule,
        MatDialogModule,
        MatSnackBarModule,
        MatTooltipModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
