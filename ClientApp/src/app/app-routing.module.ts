import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { DoctorRegisterComponent } from './doctors/doctor-register/doctor-register.component';
import { PatientRegisterComponent } from './patients/patient-register/patient-register.component';
import { MessagesComponent } from './messages/messages.component';

const routes: Routes = [
  { path: "home", component: HomeComponent },
  { path: "", component: HomeComponent, pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: 'insurances', loadChildren: './insurances/insurances.module#InsurancesModule' },
  { path: "doctor/register", component: DoctorRegisterComponent },
  { path: "patient/register", component: PatientRegisterComponent },
  { path: "reset-password", component: ForgetPasswordComponent },
  { path: "messages", component: MessagesComponent },
  { path: "**", redirectTo:"/home" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
