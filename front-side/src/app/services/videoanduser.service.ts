import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {VideoAndUser} from "../models";

@Injectable({
  providedIn: 'root'
})
export class VideoanduserService {
  BASE_URL = 'http://localhost:8000'
  constructor(private client: HttpClient) { }

  // @ts-ignore
  getVideosAndUser(option: number): Observable<VideoAndUser[]>{
    if(option == 0) {
      return this.client.get<VideoAndUser[]>(`${this.BASE_URL}/api/videos/viewed`)
    } else if(option == 1) {
      return this.client.get<VideoAndUser[]>(`${this.BASE_URL}/api/videos/liked`)
    } else if(option == 2) {
      return this.client.get<VideoAndUser[]>(`${this.BASE_URL}/api/videos/playlist`)
    } else if(option == 3) {
      return this.client.get<VideoAndUser[]>(`${this.BASE_URL}/api/videos/watchlater`)
    }
  }

  // @ts-ignore
  updateVideo(option: number, videoAndUserID: number, update: any): Observable<VideoAndUser>{
    if(option == 0) {
      return this.client.put<VideoAndUser>(
        `${this.BASE_URL}/api/videos/${videoAndUserID}`, update)
    } else if(option == 1) {
      return this.client.put<VideoAndUser>(
        `${this.BASE_URL}/api/videos/${videoAndUserID}`, update)
    } else if(option == 2) {
      return this.client.put<VideoAndUser>(
        `${this.BASE_URL}/api/videos/${videoAndUserID}`, update)
    }
  }

}
