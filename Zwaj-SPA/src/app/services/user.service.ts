import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PagenationResult } from '../models/PagenationResult';
import { User } from '../models/user';
import { UserParams } from '../models/UserParams';

// now use auth0 to send token
// const httpOption ={
//   headers: new HttpHeaders({
//     'Authorization':'Bearer '+localStorage.getItem('token')

//   })
// };

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseURl: string = environment.baseUrl + 'Users/'

  constructor(private http: HttpClient) { }

  getUsers(currentPage?: number, itemsPerPage?: number, userParams?: UserParams): Observable<PagenationResult<User[]>> {
    const pagenationResulr = new PagenationResult<User[]>();
    let params = new HttpParams;
    if (currentPage > 0 && itemsPerPage > 0) {
      params = params.append('pageNumber', currentPage.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }
    if (userParams != null) {
      params = params.append('gender', userParams.gender);
      params = params.append('minAge', userParams.minAge.toString());
      params = params.append('maxAge', userParams.maxAge.toString());
      params = params.append('orederBy', userParams.orederBy);

    }
    return this.http.get<User[]>(this.baseURl, { observe: 'response', params }).pipe(
      map(res => {

        pagenationResulr.result = res.body;
        pagenationResulr.pagenation = JSON.parse(res.headers.get('Pagination'));
        return pagenationResulr;
      })
    );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseURl + id);

  }
  updateUser(id: number, user: User) {
    return this.http.put(this.baseURl + id, user);

  }
  likeUser(id: number, likeeId) {
    return this.http.post(this.baseURl + id + '/like/' + likeeId, {});
  }

  updateIsMainPhoto(userId: number, id: number) {
    return this.http.post(`${this.baseURl}${userId}/photos/${id}/setMain`, {});
  }


  deletePhoto(userId: number, id: number) {
    return this.http.delete(`${this.baseURl}${userId}/photos/${id}`)
  }


}
