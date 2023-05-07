import {Component, OnInit} from '@angular/core';
import {MenuConditionService} from "../services/menu-condition.service";
import {CategoryService} from "../services/category.service";
import {VideoService} from "../services/video.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  categories: any = []
  public videos: any = []

  title = '"Quantum dots from Sber - OLED TV 65" for 55K with an assistant and installation .apk. That good?'
  chanel = "Wylsacom"

  ngOnInit() {
    this.getCategories()
    this.getVideos()
  }

  constructor(
    private menuConditionService: MenuConditionService,
    private categoryService: CategoryService,
    private videoService: VideoService
  ) { }

  getCategories(){
    this.categoryService.getCategories().subscribe((categories)=>{
      this.categories = categories
    })
  }

  getVideos(){
    this.videoService.getVideos().subscribe((videos) => {
      this.videos = videos
    })
  }

  getVideosByCategory(id: number) {
    this.videoService.filterVideos(id).subscribe((videos) => {
      this.videos = videos
    })
  }

  getMenuCondition() {
    return this.menuConditionService.getMenuCondition()
  }

  chooseNav(e: any) {
    for(let element of e.composedPath()[1].querySelectorAll("p")) {
      element.classList.remove("active")
    } e.composedPath()[0].classList.add("active")

    if(e.composedPath()[0].innerText == "All") this.getVideos()
    else this.getVideosByCategory(e.composedPath()[0].children[0].innerHTML)
  }


}
