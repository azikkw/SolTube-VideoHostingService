import {Component, OnInit} from '@angular/core';
import {MenuConditionService} from "../services/menu-condition.service";
import {CategoryService} from "../services/category.service";
import {VideoService} from "../services/video.service";

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent implements OnInit {

  public videos: any = []

  isAuthorized = localStorage.getItem("token")

  constructor (
    private videoService: VideoService
  ) { }

  ngOnInit() {
    this.getVideos()
  }

  getVideos(){
    this.videoService.subscribedVideos().subscribe((videos)=>{
      this.videos = videos
    })
  }

}
