import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DateListComponent } from './date-list/date-list.component';
import { DateDetailsComponent } from './date-details/date-details.component';

const routes: Routes = [
  { path: '', component: DateListComponent },
  { path: 'date-list', component: DateListComponent },
  { path: ':id', component: DateDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DatesRoutingModule { }
