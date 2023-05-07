import { Component, OnInit } from '@angular/core';
import { JwtService } from "../services/jwt.service";
import { Router } from "@angular/router";
import {User, Video} from "../models";
import { MenuConditionService } from '../services/menu-condition.service';
import {UserService} from "../services/user.service";


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User
  userVideos: Video[]
  subscribes: User[]

  constructor (
    private jwtService: JwtService,
    private router: Router,
    private menuConditionService: MenuConditionService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.getUser()
    this.getSubscribes()
  }

  getUser() {
    this.jwtService.getUser().subscribe((user) => {
      this.user = user
      console.log(this.user)
      this.getUserVideos(this.user.id)
    })
  }

  getUserVideos(id: number) {
    this.userService.getUserVideos(id).subscribe((data)=>{
      this.userVideos = data
    })
  }

  getMenuCondition() {
    return this.menuConditionService.getMenuCondition()
  }

  chooseNav(e: any) {
    document.querySelectorAll(".navigation p").forEach(p => {
      p.classList.remove("active")
    })
    e.composedPath()[0].classList.add("active")
    console.log(e.composedPath()[0].dataset["nav"])
    document.querySelector(".pages_container").className = `pages_container ${e.composedPath()[0].dataset["nav"]}`
  }
  navigateToAbout() {
    document.querySelectorAll(".navigation p").forEach(p => {
      p.classList.remove("active")
    });
    document.querySelector(".navigation p:last-child").classList.add("active")
    document.querySelector(".pages_container").className = "pages_container data_about"
  }

  logout() {
    localStorage.removeItem('token')
    this.router.navigate(['/home']).then(() => {
      location.reload()
    })
  }

  getSubscribes(){
    this.userService.subscribedUsers().subscribe((data)=>{
      this.subscribes = data
    })
  }

}
