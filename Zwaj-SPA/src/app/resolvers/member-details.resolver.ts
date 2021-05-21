import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router } from "@angular/router";
import { of } from "rxjs";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { User } from "../models/user";
import { AlertifyService } from "../services/alertify.service";
import { UserService } from "../services/user.service";

@Injectable()
export class MemberDetailsResolver implements Resolve<User>{

  constructor(private userServices: UserService,
    private router: Router, private alert: AlertifyService) {

  }
  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    const id = <number>route.params['id']
    return this.userServices.getUser(id).pipe(
      catchError(error => {
        this.alert.error('resolve not work -- MemberDetailsResolver');
        this.router.navigate(['/members']);
        return of(null);
      })
    );
  }

}
