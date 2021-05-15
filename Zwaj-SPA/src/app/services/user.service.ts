import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

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

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseURl);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseURl + id);

  }
  updateUser(id: number, user: User) {
    return this.http.put(this.baseURl + id, user);

  }

  updateIsMainPhoto(userId: number, id: number) {
    return this.http.post(`${this.baseURl}${userId}/photos/${id}/setMain`, {});
  }


  deletePhoto(userId: number, id: number) {
    return this.http.delete(`${this.baseURl}${userId}/photos/${id}`)
  }

}
