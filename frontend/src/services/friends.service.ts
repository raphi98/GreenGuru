import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  private userUrl = '/api/users/';

  constructor(private http: HttpClient) {}

  addFriend(userId:number, username: string) {
    const authToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.put(`${this.userUrl}${userId}?add_friend=${username}`, {}, {headers});
  }

  removeFriend(userId:number, username: string) {
    const authToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.put(`${this.userUrl}${userId}?remove_friend=${username}`, {}, {headers});
  }

}
