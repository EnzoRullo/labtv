import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export let searchStrExp: string = ""

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})

export class NavBarComponent implements OnInit {

  windowWidth:number = 0
  nascondiMenu: boolean = true;
  search: string = "";
  loggedIn: boolean = false

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    window.addEventListener("resize", () => {
      this.getWindowSize();
      if(this.windowWidth <= 950){
        this.nascondiMenu = true;
      }
    })
  }

  ngOnInit(): void {
    this.authService.loggedInSubject.subscribe((value) => this.loggedIn = value);
    this.loggedIn = this.authService.isUserLoggedIn();

    this.getWindowSize()
  }

  searchSubmit() {
    console.log(this.windowWidth)
    if (this.search.trim().length > 0) {
      searchStrExp = this.search
      this.router.navigate(["/search"])
    }
    this.search = ""
  }

  getWindowSize(){
    this.windowWidth = window.innerWidth
  }
}
