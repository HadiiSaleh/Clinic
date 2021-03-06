import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { LoginComponent } from './login/login.component';
import { MessagesComponent } from './messages/messages.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { JwtInterceptor } from './_helper/jwt.Interceptor';
import { DataTablesModule } from 'angular-datatables';
import { MessagesListComponent } from './users/messages-list/messages-list.component';

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    LoginComponent,
    MessagesComponent,
    HomeComponent,
    ForgetPasswordComponent,
    MessagesListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ModalModule.forRoot(),
    DataTablesModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
