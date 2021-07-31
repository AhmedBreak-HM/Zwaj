import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user';
import { AlertifyService } from '../services/alertify.service';
import { UserService } from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class ListsResolver implements Resolve<User[]> {
  pageNumber = 1;
  pageSize = 6;
  likeParam = 'likers';
  constructor(private userService: UserService, private alert: AlertifyService,
              private router: Router) {

  }
  resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
    return this.userService.getUsers(this.pageNumber, this.pageSize, null, this.likeParam).pipe(
      catchError(error => {
        this.alert.error('Load data has error' + error);
        this.router.navigate(['']);
        return of(null);
      })
    );
  }
}
