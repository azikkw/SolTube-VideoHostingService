import { Injectable } from '@angular/core';

import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import { AuthToken, User } from "../models";

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  BASE_URL = 'http://localhost:8000'

  constructor(private client: HttpClient) { }

  login (
    username: string,
    password: string
  ): Observable<AuthToken> {
    return this.client.post<AuthToken> (
      `${this.BASE_URL}/api/login/`,
      {
        username,
        password
      }
    )
  }

  register (
    username: string,
    password: string,
    first_name: string,
    last_name: string
  ): Observable<User> {
    return this.client.post<User> (
      `${this.BASE_URL}/api/register/`,
      {
        username,
        password,
        first_name,
        last_name
      }
    )
  }

  getUser(): Observable<User> {
    return this.client.get<User>(`${this.BASE_URL}/api/user/`)
  }

}
