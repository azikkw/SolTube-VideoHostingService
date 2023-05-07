import {Component, OnInit} from '@angular/core';
import {VideoService} from "../services/video.service";

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  isAuthorized = localStorage.getItem("token")
  videos: any = []

  ngOnInit() {
    this.getVideos()
  }

  constructor(private videoService: VideoService) {
  }

  clearAllHistory() {

  }

  getVideos(){
    this.videoService.watchedVideos().subscribe((data)=>{
      this.videos = data
    })
  }

}
