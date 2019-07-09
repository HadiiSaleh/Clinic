import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor } from '../_helper/jwt.Interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';
import { InsuranceListComponent } from './insurance-list/insurance-list.component';
import { InsuranceDetailsComponent } from './insurance-details/insurance-details.component';

import { InsurancesRoutingModule } from './insurances-routing.module';

@NgModule({
  declarations: [InsuranceListComponent,
    InsuranceDetailsComponent,
  ],
  imports: [
    CommonModule,
    InsurancesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
})
export class InsurancesModule { }
