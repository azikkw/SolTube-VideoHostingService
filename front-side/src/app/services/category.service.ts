import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Category} from "../models";


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  BASE_URL = 'http://localhost:8000'

  constructor(private client: HttpClient) { }

  getCategories(): Observable<Category[]>{
    return this.client.get<Category[]>(`${this.BASE_URL}/api/categories/`)
  }
}
