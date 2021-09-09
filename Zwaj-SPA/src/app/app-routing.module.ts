import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ListsComponent } from './lists/lists.component';
import { MemberDetailsComponent } from './member/member-details/member-details.component';
import { MemberEditComponent } from './member/member-edit/member-edit.component';
import { MemberListComponent } from './member/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsResolver } from './resolvers/lists.resolver';
import { MemberDetailsResolver } from './resolvers/member-details.resolver';
import { MessageResolver } from './resolvers/message.resolver';
import { AuthGuard } from './services/guards/auth.guard';
import { PreventUnsavedChangesGuard } from './services/guards/prevent-unsaved-changes.guard';


const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'members', component: MemberListComponent },
      { path: 'member/edit', component: MemberEditComponent, canDeactivate: [PreventUnsavedChangesGuard] },
      {
        path: 'member/:id', component: MemberDetailsComponent,
        resolve: { user: MemberDetailsResolver }, pathMatch: 'full'
      },
      {
        path: 'lists', component: ListsComponent,
        resolve: { users: ListsResolver }
      },
      {
        path: 'messages', component: MessagesComponent,
        resolve: { messages: MessageResolver }
      },
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
