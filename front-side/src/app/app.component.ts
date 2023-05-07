import {AfterViewInit, Component, OnInit} from '@angular/core';
import { HomeComponent } from "./home/home.component";
import { VideoItemComponent } from "./video-item/video-item.component";
import { MenuConditionService } from "./services/menu-condition.service";
import {JwtService} from "./services/jwt.service";
import {User} from "./models";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  user: User

  activePage: string = location.pathname.slice(1)

  isAuthorized = localStorage.getItem("token")

  constructor(private menuConditionService: MenuConditionService, private jwtService: JwtService) { }

  ngOnInit(): void {
    const menu = document.querySelector(".left")
    if(localStorage.getItem("menu") != null) { // @ts-ignore
      menu.className = localStorage.getItem("menu") // @ts-ignore
    } else menu.className = "left close"

    this.activePage = location.pathname.slice(1)
    this.setActivePageLink()

    this.isAuthorized = localStorage.getItem("token")
    this.getUser()
  }

  getUser() {
    this.jwtService.getUser().subscribe((user) => {
      this.user = user
    })
  }

  menuClose(e: any) {
    const menu = e.composedPath()[2]
    menu.classList.toggle("close")
    localStorage.setItem("menu", menu.className) // @ts-ignore
    this.menuConditionService.setMenuCondition(localStorage.getItem("menu"))
  }

  selectScreen(e: any) {
    for(let element of e.composedPath()[3].querySelectorAll("ul li")) {
      element.classList.remove("active")
    } e.composedPath()[1].classList.add("active")
  }

  setActivePageLink() {
    const pageLinksAlt = document.querySelectorAll('.left nav ul li a .icons img:first-child') // @ts-ignore
    for(let element of pageLinksAlt) {
      if(element.alt == this.activePage) {
        element.closest('li').classList.add("active")
      }
    }
  }

}
