import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../models/message';
import { AlertifyService } from '../services/alertify.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class MessageResolver implements Resolve<Message[]> {
  pageNumber = 1;
  pageSize = 6;
  messageTypeParam = 'Unread';
  constructor(private authServices: AuthService, private userService: UserService, private alert: AlertifyService,
              private router: Router) {

  }
  resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
    return this.userService.getMessage(this.authServices.decodedToken.nameid,
      this.pageNumber, this.pageSize, this.messageTypeParam).pipe(
        catchError(error => {
          this.alert.error('Load data has error' + error);
          this.router.navigate(['']);
          return of(null);
        })
      );
  }
}
