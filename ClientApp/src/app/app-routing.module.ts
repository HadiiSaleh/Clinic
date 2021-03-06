import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { MessagesComponent } from './messages/messages.component';
import { MessagesListComponent } from './users/messages-list/messages-list.component';

const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "", component: HomeComponent, pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: 'insurances', loadChildren: './insurances/insurances.module#InsurancesModule' },
  { path: 'doctors', loadChildren: './doctors/doctors.module#DoctorsModule' },
  { path: 'assistants', loadChildren: './assistants/assistants.module#AssistantsModule' },
  { path: 'patients', loadChildren: './patients/patients.module#PatientsModule' },
  { path: 'dates', loadChildren: './dates/dates.module#DatesModule' },
  { path: "reset-password", component: ForgetPasswordComponent },
  { path: "messages", component: MessagesComponent },
  { path: "messages-list", component: MessagesListComponent },
  { path: "**", redirectTo:"/home" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
