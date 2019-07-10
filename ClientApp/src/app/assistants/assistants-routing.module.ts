import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssistantListComponent } from './assistant-list/assistant-list.component';
import { AssistantDetailsComponent } from './assistant-details/assistant-details.component';

const routes: Routes = [
  { path: '', component: AssistantListComponent },
  { path: 'assistant-list', component: AssistantListComponent },
  { path: ':id', component: AssistantDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssistantsRoutingModule { }
