import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberDetailsComponent } from './member/member-details/member-details.component';
import { MemberEditComponent } from './member/member-edit/member-edit.component';
import { MemberListComponent } from './member/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { MemberDetailsResolver } from './resolvers/member-details.resolver';
import { AuthGuard } from './services/guards/auth.guard';


const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'members', component: MemberListComponent },
      { path: 'member/edit', component: MemberEditComponent },
      {
        path: 'member/:id', component: MemberDetailsComponent,
        resolve: { user: MemberDetailsResolver }, pathMatch: 'full'
      },
      { path: 'lists', component: ListsComponent },
      { path: 'messages', component: MessagesComponent },
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
