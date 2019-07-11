import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatesRoutingModule } from './dates-routing.module';
import { DateListComponent } from './date-list/date-list.component';
import { DateDetailsComponent } from './date-details/date-details.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor } from '../_helper/jwt.Interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [DateListComponent, DateDetailsComponent],
  imports: [
    CommonModule,
    DatesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
})
export class DatesModule { }
