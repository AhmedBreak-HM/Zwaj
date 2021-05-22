import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from "@auth0/angular-jwt";
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { FileUploadModule } from 'ng2-file-upload';

import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { AuthGuard } from './services/guards/auth.guard';
import { AlertifyService } from './services/alertify.service';
import { ErrorInterceptorProvidor } from './services/error.interceptor';
import { MemberDetailsResolver } from './resolvers/member-details.resolver';


import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component';
import { NavComponent } from './nav/nav.component';
import { RegisterComponent } from './register/register.component';
import { MemberListComponent } from './member/member-list/member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { MemberCardComponent } from './member/member-card/member-card.component';
import { MemberDetailsComponent } from './member/member-details/member-details.component';
import { MemberGalleryComponent } from './member/member-gallery/member-gallery.component';
import { MemberEditComponent } from './member/member-edit/member-edit.component';
import { PreventUnsavedChangesGuard } from './services/guards/prevent-unsaved-changes.guard';
import { PhotoEditorComponent } from './member/photo-editor/photo-editor.component';
import { TimeAgoPipe } from 'time-ago-pipe';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    RegisterComponent,
    MemberListComponent,
    ListsComponent,
    MessagesComponent,
    MemberCardComponent,
    MemberDetailsComponent,
    MemberGalleryComponent,
    MemberEditComponent,
    PhotoEditorComponent,
    TimeAgoPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    // @auth0/angular-jwt send token with http header request
    // https://github.com/auth0/angular2-jwt
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('token');
        },
        whitelistedDomains: ['localhost:5000'],

        blacklistedRoutes: ['localhost:5000/api/auth'],
      },
    }),
    // ---------------------------------------------------------
    BsDropdownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TabsModule.forRoot(),
    NgxGalleryModule,
    FileUploadModule

  ],
  providers: [

    // Globsl Http Interceptor
    ErrorInterceptorProvidor,
    // Guards
    AuthGuard,
    PreventUnsavedChangesGuard,


    // Resolvers
    MemberDetailsResolver,

    // Services
    AuthService,
    UserService,
    AlertifyService,


  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
