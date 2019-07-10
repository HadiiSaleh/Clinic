import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssistantsRoutingModule } from './assistants-routing.module';
import { AssistantListComponent } from './assistant-list/assistant-list.component';
import { AssistantDetailsComponent } from './assistant-details/assistant-details.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtInterceptor } from '../_helper/jwt.Interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DataTablesModule } from 'angular-datatables';

@NgModule({
  declarations: [AssistantListComponent, AssistantDetailsComponent],
  imports: [
    CommonModule,
    AssistantsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
})
export class AssistantsModule { }
