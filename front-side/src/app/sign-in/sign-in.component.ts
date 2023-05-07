import {Component, OnInit} from '@angular/core';

import { Location } from "@angular/common";
import { Router } from "@angular/router";

import { JwtService } from "../services/jwt.service";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {

  ngOnInit() {
    if(localStorage.getItem('token'))  this.router.navigate(['/home']).then()
  }

  constructor(private location: Location, private jwtService: JwtService, private router: Router) { }

  signIn(value: any, e: any) {
    const signIn = e.composedPath()[0] as HTMLElement
    const notification = document.querySelector(".error") as HTMLElement

    this.jwtService.login(value.username, value.password).subscribe((data) => {
      localStorage.setItem('token', data.token)
    },
    (httpError: HttpErrorResponse) => { this.checkToToken(false, signIn, notification) },
    () => { this.checkToToken(true, signIn, notification) })
  }
  checkToToken(result: boolean, signIn: HTMLElement, errorOrSuccess: HTMLElement) {
    if(result) {
      errorOrSuccess.innerHTML = "Successful login to the SolTube !"; errorOrSuccess.classList.add("show")
      setTimeout(() => {
        this.router.navigate(['/home']).then(() => {
          location.reload()
        })
      }, 1500)
    } else {
      errorOrSuccess.innerHTML = "Check your email or password !"; errorOrSuccess.classList.add("show")
      signIn.querySelectorAll(".input_block").forEach(inputBlock => {
        inputBlock.classList.add("fill_all")
        inputBlock.querySelector("input").value = ""
        setTimeout(() => {
          inputBlock.classList.remove("fill_all")
          errorOrSuccess.classList.remove("show")
        }, 3000)
      })
    }
  }

  showHidePassword(action: boolean, e: any) {
    const passwordInput = e.composedPath()[2].children[1]
    action ? this.show(passwordInput) : this.hide(passwordInput)
  }
  show(passwordInput: HTMLInputElement) {
    document.querySelector(".show_hide_btn").className = "show_hide_btn show"
    passwordInput.type = "text"
  }
  hide(passwordInput: HTMLInputElement) {
    document.querySelector(".show_hide_btn").className = "show_hide_btn hide"
    passwordInput.type = "password"
  }

  returnBack() {
    this.location.back()
  }

}
