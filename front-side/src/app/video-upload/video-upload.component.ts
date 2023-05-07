import { AfterViewInit, Component, OnInit } from '@angular/core';

import { Location } from "@angular/common";
import { Router } from "@angular/router";

import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage'

import { CategoryService } from "../services/category.service";
import { VideoService } from "../services/video.service";


@Component({
  selector: 'app-video-upload',
  templateUrl: './video-upload.component.html',
  styleUrls: ['./video-upload.component.css']
})
export class VideoUploadComponent implements AfterViewInit, OnInit {

  categories: any = []
  public que: number

  public videoSource: any = {}
  public previewSource: any = {}

  public previewImg: any = ""
  public previewVideo: any = ""

  private totalProgress: number = 0

  ngOnInit() {
    this.getCategories()
  }

  constructor(
    private location: Location,
    private router: Router,
    private storage: Storage,
    private categoryService: CategoryService,
    private videoService: VideoService
  ) {
  }

  getCategories() {
    this.categoryService.getCategories().subscribe((categories) => {
      this.categories = categories
    })
  }

  ngAfterViewInit() {
    this.openChooseCategory()
  }

  // Video loading
  chooseVideo(event: any) {
    this.videoSource = event.target.files[0]
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event: any) => {
      this.previewVideo = event.target.result
    }
  }

  uploadVideo(value: any) {
    const storageRef = ref(this.storage, 'videos/' + this.videoSource.name)
    const uploadTask = uploadBytesResumable(storageRef, this.videoSource)
    const progressBar = document.querySelector(".progress_bar") as HTMLElement // @ts-ignore

    uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 93;
        this.totalProgress += Math.abs(this.totalProgress - progress)
        console.log('Upload is ' + this.totalProgress + '% done')

        document.querySelector(".percent_value").innerHTML = `${Math.floor(this.totalProgress)}%`
        progressBar.style.width = `${this.totalProgress}%`
      },
      () => {
      },
      () => { // @ts-ignore
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          value.video_url = downloadURL
          this.uploadPreview(value)
        })
      })
  }

  // Preview loading
  choosePreview(event: any) {
    this.previewSource = event.target.files[0]
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = (event: any) => {
      this.previewImg = event.target.result
    }
  }

  uploadPreview(value: any) {
    const storageRef = ref(this.storage, 'preview/' + this.previewSource.name)
    const uploadTask = uploadBytesResumable(storageRef, this.previewSource)
    const progressBar = document.querySelector(".progress_bar") as HTMLElement // @ts-ignore

    uploadTask.on('state_changed', (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 7;
        this.totalProgress += Math.abs((this.totalProgress - 93) - progress)
        console.log('Upload is ' + this.totalProgress + '% done');

        document.querySelector(".percent_value").innerHTML = `${Math.floor(this.totalProgress)}%`
        progressBar.style.width = `${this.totalProgress}%`
      },
      () => {
      },
      () => { // @ts-ignore
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          value.image_url = downloadURL
          this.createVideo(value)
        })
      })
  }

  // Sending data to the back-side
  videoUpload(value: any, e: any) {
    const videoUploadForm = e.composedPath()[0]

    value.categoryId = videoUploadForm.querySelector(".video_category_input").dataset["id"]
    value.totalDuration = this.formatDuration(videoUploadForm.querySelector(".preview_video").duration)

    if(videoUploadForm.querySelector(".video_uploading_btn").className == "video_uploading_btn active") {
      this.uploadVideo(value)
    }
  }

  // Navigation
  chooseNav(e: any) {
    document.querySelectorAll(".navigation div").forEach(p => {
      p.classList.remove("active")
    })
    e.composedPath()[0].classList.add("active")
    document.querySelector(".pages_container").className = `pages_container ${e.composedPath()[0].dataset["nav"]}`

    this.makeButtonActive()
  }

  // Choose category selector
  openChooseCategory() {
    document.addEventListener("click", e => {
      let target = e.target as Element // @ts-ignore
      if (target.className !== "input_block choose") {
        document.querySelector(".select_category").classList.remove("open")
      } else document.querySelector(".select_category").classList.add("open")
    })
  }

  selectCategory(e: any) {
    const categoryValue = document.querySelector(".input_block.choose input") as HTMLInputElement
    categoryValue.value = e.composedPath()[0].innerText
    categoryValue.dataset["id"] = e.composedPath()[0].children[0].innerHTML
  }

  // Return back function
  returnBack() {
    this.location.back()
  }

  createVideo(video: any) {
    const success = document.querySelector(".notification") as HTMLElement
    this.videoService.postVideo(video).subscribe(() => {
        this.totalProgress = 0
      },
      () => {
      },
      () => {
        success.classList.add("show")
        setTimeout(() => {
          success.classList.remove("show")
          this.router.navigate(['/home']).then(() => {
            location.reload()
          })
        }, 2000)
      })
  }

  makeButtonActive() {
    const title = document.querySelector(".video_title_input") as HTMLInputElement
    const description = document.querySelector(".video_description_input") as HTMLInputElement
    const category = document.querySelector(".video_category_input") as HTMLInputElement

    if (title.value != "" && description.value != "" && category.value != "" && this.previewVideo != "" && this.previewImg != "") {
      document.querySelector(".video_uploading_btn").classList.add("active")
    } else document.querySelector(".video_uploading_btn").classList.remove("active")
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

}
