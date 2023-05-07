import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User, Video} from "../models";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  BASE_URL = 'http://localhost:8000'

  constructor(private client: HttpClient) { }

  updateUser (
    username: string,
    description: string,
    firstName: string,
    lastName: string
  ) {
    return this.client.put<User>(
      `${this.BASE_URL}/api/user/`,
      {
        username: username,
        description: description,
        first_name: firstName,
        last_name: lastName
      }
    )
  }

  search(username: string): Observable<User>{
    return this.client.get<User>(`${this.BASE_URL}/api/search/${username}`)
  }

  getUserVideos(id: number): Observable<Video[]>{
    return this.client.get<Video[]>(`${this.BASE_URL}/api/videos/user/${id}`)
  } // @ts-ignore

  subscribeToUser(id: number): Observable<any> {
    return this.client.put<any>(
      `${this.BASE_URL}/api/user/${id}/subscribe`,
      {}
    )
  }

  deleteUser():Observable<any>{
    return this.client.delete<any>(
      `${this.BASE_URL}/api/user/`
    )
  }

  subscribedUsers():Observable<User[]>{
    return this.client.get<User[]>(
      `${this.BASE_URL}/api/subcribed/users`
    )
  }

}
