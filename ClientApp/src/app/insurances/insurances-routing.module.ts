import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InsuranceListComponent } from './insurance-list/insurance-list.component';
import { InsuranceDetailsComponent } from './insurance-details/insurance-details.component';

const routes: Routes = [
  { path: '', component: InsuranceListComponent },
  { path: 'insurance-list', component: InsuranceListComponent },
  { path: ':id', component: InsuranceDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsurancesRoutingModule { }
