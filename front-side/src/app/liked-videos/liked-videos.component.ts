import {Component, OnInit} from '@angular/core';
import {VideoService} from "../services/video.service";

@Component({
  selector: 'app-liked-videos',
  templateUrl: './liked-videos.component.html',
  styleUrls: ['./liked-videos.component.css']
})
export class LikedVideosComponent implements OnInit {

  isAuthorized = localStorage.getItem("token")

  likedVideos: any = []
  index = 1

  constructor(private videoService: VideoService) { }

  ngOnInit() {
    this.getLikedVideos()
  }

  clearAllLiked() {

  }

  getLikedVideos(){
    this.videoService.likedVideos().subscribe((liked)=>{
      this.likedVideos = liked
    })
  }



}
