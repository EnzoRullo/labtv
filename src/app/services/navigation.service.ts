import { Injectable } from '@angular/core';
import { Location } from "@angular/common";
import { Router, NavigationEnd } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private history: string[] = []

  constructor(
    private router: Router,
    private location: Location
  ) {
    
    this.router.events.subscribe({
      next: (e) => {
       if(e instanceof NavigationEnd){
        this.history.push(e.urlAfterRedirects);
       }
      }
    })
   }

   back(){
    if(this.history.length > 0){
      this.location.back()
    }
   }
}
