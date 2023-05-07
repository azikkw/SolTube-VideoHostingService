import {AfterViewInit, Component, ElementRef, OnInit} from '@angular/core';
import { MenuConditionService } from "../services/menu-condition.service";
import {Video} from "../models";
import {ActivatedRoute} from "@angular/router";
import {VideoService} from "../services/video.service";
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-video-page',
  templateUrl: './video-page.component.html',
  styleUrls: ['./video-page.component.css']
})
export class VideoPageComponent implements AfterViewInit, OnInit {

  video: Video = {} as Video
  ownerVideos: Video[] = []
  categoryVideos: Video[] = []

  likedVideos: any = []
  isLiked: number = 0

  videoCondition: boolean

  isScrubbing: boolean = false

  linkToVideo: string = ""

  constructor(private elementRef:ElementRef, private route: ActivatedRoute, private videoService: VideoService, private userService: UserService) {
    this.videoCondition = false
  }

  ngOnInit() {
    this.getVideo()
    this.getLikedVideos()
  }
  ngAfterViewInit() {
    // Initialize video documents
    const video = this.elementRef.nativeElement.querySelector("video")
    const videoContainer = this.elementRef.nativeElement.querySelector(".video_container")
    // Video option functions
    this.checkVideoCondition(video)
    this.actionsWithKeyboard(video)
    this.fullScreenChange(videoContainer)
    this.miniPlayerChange(video, videoContainer)
    this.checkVolumeChanges(video, videoContainer)
    this.durationTotal(video)
    this.currentTimeProgress(video)
    this.handleInputChange()
    this.checkIsScrubbing()
    this.checkToOpenSpeedOptions()
    this.selectSpeed(video)
    this.closeMoreWindow()
  }

  getVideo() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.videoService.getVideo(id).subscribe((video) => {
      this.video = video
      this.video.upload_time = new Date(video.upload_time)
    },
    () => {},
    () => {
      this.getVideosFromThisOwner()
      this.getVideosFromSameCategory()
    })
  }

  getVideosFromThisOwner() {
    this.userService.getUserVideos(this.video.owner.id).subscribe((videos) => {
      this.ownerVideos = videos.filter((video) => {
        return video.id != this.video.id
      })
    })
  }

  getVideosFromSameCategory() {
    this.videoService.filterVideos(this.video.category.id).subscribe((videos) => {
      this.categoryVideos = videos.filter((video) => {
        return video.owner.username != this.video.owner.username
      })
    })
  }

  // Play and pause actions
  playPauseAction() {
    const video = document.querySelector("video")
    this.togglePlay(video)
  }
  togglePlay(video: any) {
    (video.paused) ? video.play() : video.pause()
  }
  checkVideoCondition(video: any) {
    video.addEventListener("play", () => { this.videoCondition = true })
    video.addEventListener("pause", () => { this.videoCondition = false })
  }

  // Manage video by keyboard
  actionsWithKeyboard(video: any) {
    document.addEventListener("keydown", e => {
      const tagName = document.activeElement.tagName.toLowerCase()
      if(tagName === "input") return
      switch(e.key.toLowerCase()) { // @ts-ignore
        case " ":
          if(tagName === "button") return
        case "k":
          this.togglePlay(video)
          break
        case "f":
          this.toggleFullScreenMode()
          break
        case "i":
          this.toggleMiniPlayerMode()
          break
        case "m":
          this.videoMute()
          break
        case "arrowleft":
        case "j":
          this.skip(-5)
          break
        case "arrowright":
        case "l":
          this.skip(5)
          break
      }
    })
  }

  // Volume options
  videoMute() {
    document.querySelector("video").muted = !document.querySelector("video").muted
  }
  checkVolumeChanges(video: any, videoContainer: any) {
    video.addEventListener("volumechange", () => { // @ts-ignore
      document.querySelector(".volume_slider").value = video.volume
      let volumeLevel

      if(video.muted || video.volume === 0) { // @ts-ignore
        document.querySelector(".volume_slider").value = 0
        volumeLevel = "muted"
      }
      else if(video.volume >= .5) volumeLevel = "high"
      else volumeLevel = "low"

      videoContainer.dataset.volumeLevel = volumeLevel
    })
  }
  volumeSlider(e: any) {
    document.querySelector("video").volume = e.target.value // @ts-ignore
    document.querySelector("video").muted = e.target.value === 0
  }
  handleInputChange() {
    const input = document.querySelector('input[type="range"]')
    input.addEventListener("input", e => {
      let target = e.target as HTMLInputElement

      const min = target.min
      const max = target.max
      const val = target.value // @ts-ignore

      target.style.backgroundSize = (val - min) * 100 / (max - min) + '% 100%'
    })
  }

  // Duration
  durationTotal(video: any) {
    video.addEventListener("loadeddata", () => {
      document.querySelector(".total_time").textContent = this.formatDuration(video.duration)
    })
  }
  currentTimeProgress(video: any) {
    video.addEventListener("timeupdate", () => {
      document.querySelector(".current_time").textContent = this.formatDuration(video.currentTime)

      const timelineContainer: HTMLElement = document.querySelector(".timeline_container")
      const percent = video.currentTime / video.duration // @ts-ignore
      timelineContainer.style.setProperty("--progress-position", percent)
    })
  }
  leadingZeroFormatter(): Intl.NumberFormat {
    return new Intl.NumberFormat(undefined, {
      minimumIntegerDigits: 2
    })
  }
  formatDuration(time: any): any {
    const seconds = Math.floor(time % 60)
    const minutes = Math.floor(time / 60) % 60
    const hours = Math.floor(time / 3600)

    if(hours === 0) return `${minutes}:${this.leadingZeroFormatter.call("").format(seconds)}`
    else return `${hours}:${this.leadingZeroFormatter.call("").format(minutes)}
                :${this.leadingZeroFormatter.call("").format(seconds)}`
  }
  skip(value: number) {
    document.querySelector("video").currentTime += value
  }

  // Video speed options
  openSpeedOptions() {
    document.querySelector(".speed_options").classList.toggle("show")
  }
  checkToOpenSpeedOptions() {
    document.addEventListener("click", e => {
      let target = e.target as Element
      if(target.className !== "speed_btn_img") {
        document.querySelector(".speed_options").classList.remove("show")
      }
    })
  }
  selectSpeed(video: any) {
    const speedOptions = document.querySelector(".speed_options")
    speedOptions.querySelectorAll("li").forEach(option => {
      option.addEventListener("click", () => {
        video.playbackRate = option.dataset['speed']
        speedOptions.querySelector(".active").classList.remove("active")
        option.classList.add("active")
      })
    })
  }

  // View models
  toggleFullScreenMode() {
    if(document.fullscreenElement == null) {
      document.querySelector(".video_container").requestFullscreen().then()
    } else document.exitFullscreen().then()
  }
  toggleMiniPlayerMode() {
    if(document.querySelector(".video_container").classList.contains("mini_player")) {
      document.exitPictureInPicture().then()
    } else document.querySelector("video").requestPictureInPicture().then()
  }
  fullScreenChange(videoContainer: any) {
    document.addEventListener("fullscreenchange", () => {
      videoContainer.classList.toggle("full_screen", document.fullscreenElement)
    })
  }
  miniPlayerChange(video: any, videoContainer: any) {
    video.addEventListener("enterpictureinpicture", () => { videoContainer.classList.add("mini_player") })
    video.addEventListener("leavepictureinpicture", () => { videoContainer.classList.remove("mini_player") })
  }

  // Video timeline options
  handleTimelineUpdate(e: any) {
    const timelineContainer: HTMLElement = document.querySelector(".timeline_container")

    const rect = timelineContainer.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width // @ts-ignore

    timelineContainer.style.setProperty("--preview-position", percent)
    if(this.isScrubbing) {
      e.preventDefault() // @ts-ignore
      timelineContainer.style.setProperty("--progress-position", percent)
    }
  }
  toggleScrubbing(e: any) {
    const timelineContainer: HTMLElement = document.querySelector(".timeline_container")
    const video = document.querySelector("video")

    const rect = timelineContainer.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width

    this.isScrubbing = (e.buttons & 1) === 1
    document.querySelector(".video_container").classList.toggle("scrubbing", this.isScrubbing)

    if(this.isScrubbing) {
      video.pause()
    }
    else {
      video.currentTime = percent * video.duration
      video.play().then()
    }

    this.handleTimelineUpdate(e)
  }
  checkIsScrubbing() {
    document.addEventListener("mouseup", e => {
      if(this.isScrubbing) this.toggleScrubbing(e)
    })
    document.addEventListener("mousemove", e => {
      if(this.isScrubbing) this.handleTimelineUpdate(e)
    })
  }

  closeMoreWindow() {
    document.addEventListener("click", e => {
      let target = e.target as Element
      if(target.className !== "more_open_btn") {
        document.querySelector(".more_open").classList.remove("open")
      }
    })
  }

  // Share window
  openShareWindow(e: any) {
    const shareWindow = document.querySelector(".share_window")
    const linkToVideo = shareWindow.querySelector("input")

    document.querySelector("video").pause()

    shareWindow.classList.add("open")
    document.body.classList.add("lock")
    e.composedPath()[1].classList.remove("open")

    linkToVideo.value = location.href
    this.linkToVideo = linkToVideo.value
  }
  closeShareWindow(e: any) {
    if(e.composedPath()[0].className == "close_share") {
      e.composedPath()[3].classList.remove("open")
      document.body.classList.remove("lock")
      document.querySelector("video").play().then()
    }
    else if(e.composedPath()[0].className == "share_window open") {
      e.composedPath()[0].classList.remove("open")
      document.body.classList.remove("lock")
      document.querySelector("video").play().then()
    }
  }
  // Copying video to the clipboard
  copyToClipboard() {
    const successfullyCopied = document.querySelector(".successfully_copied")
    navigator.clipboard.writeText(this.linkToVideo)
    .then(() => {
      successfullyCopied.classList.add("show")
      setTimeout(() => {
        successfullyCopied.classList.remove("show")
      }, 3000)
    })
  }

  // Like and dislike video
  likeOrDislikeVideo(condition: boolean, option: number) {
    condition ? this.like(option) : this.dislike(option)
  }
  like(option: number) {
    if(document.querySelector(".like.liked")) {
      this.videoService.likeOperations(this.video.id, 0).subscribe(() => {
        document.querySelector(".like").classList.remove("liked")
      })
    }
    else {
      this.videoService.likeOperations(this.video.id, option).subscribe(() => {
        document.querySelector(".dislike").classList.remove("disliked")
        document.querySelector(".like").classList.add("liked")
      })
    }
  }
  dislike(option: number) {
    if(document.querySelector(".dislike.disliked")) {
      this.videoService.likeOperations(this.video.id, 0).subscribe(() => {
        document.querySelector(".like").classList.remove("disliked")
      })
    }
    else {
      this.videoService.likeOperations(this.video.id, option).subscribe(() => {
        document.querySelector(".like").classList.remove("liked")
        document.querySelector(".dislike").classList.add("disliked")
      })
    }
  }
  getLikedVideos() {
    this.videoService.likedVideos().subscribe((liked)=>{
      this.likedVideos = liked; let cnt = 0
      this.likedVideos.forEach((video: { id: number; }) => {
        if(video.id == this.video.id) cnt++
      })
      if(cnt > 0) this.isLiked = 1
    })
  }

}
