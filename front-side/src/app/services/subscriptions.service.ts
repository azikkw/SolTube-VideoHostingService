import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Subscription} from "../models";

@Injectable({
  providedIn: 'root'
})
export class SubscriptionsService {
  BASE_URL = 'http://localhost:8000'

  constructor(private client: HttpClient) { }

  getSubscriptions(): Observable<Subscription[]>{
    return this.client.get<Subscription[]>(`${this.BASE_URL}/api/subscriptions/`)
  }

}
