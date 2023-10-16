import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoggedUser, LoginDto, Purchase, RegisterDto, User } from '../models/user';
import { environment } from 'src/environments/environment';
import { Observable, Subject } from 'rxjs';
import { movieDetailResponse } from '../models/movie-model';
import { tvDetailResponse } from '../models/tv-model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private router: Router
    ) { }

  registerMode: boolean = false;
  loggedIn: boolean = false;
  loggedInSubject: Subject<boolean> = new Subject<boolean>
  //purchasedList: Purchase[] = [];
  //purchased: boolean = false;

  setLoggedIn(user: LoggedUser) {
    localStorage.setItem("user", JSON.stringify(user))
    this.loggedIn = true;
    this.loggedInSubject.next(this.loggedIn);
  }

  setLogOut() {
    localStorage.removeItem("user")
    this.loggedIn = false;
    //this.purchasedList = [];
    this.loggedInSubject.next(this.loggedIn);
    //this.router.navigate(["/login"])
  }

  register(user: RegisterDto): Observable<LoggedUser> {
    return this.http.post<LoggedUser>(environment.LABTV_DB + "register", user);
  }

  login(user: LoginDto): Observable<LoggedUser> {
    return this.http.post<LoggedUser>(environment.LABTV_DB + "login", user);
  }

  isUserLoggedIn(): boolean {
    let user = localStorage.getItem("user");

    if (user) {
      this.loggedIn = true
    } else {
      this.loggedIn = false
    }

    return this.loggedIn
  }

  purchase(mediaType: string, purchasedMedia: movieDetailResponse | tvDetailResponse): Observable<Purchase> | null {
    let loggedUser = localStorage.getItem("user");

    if (loggedUser) {
      let theUser: LoggedUser = JSON.parse(loggedUser)
      let purchased = new Purchase(theUser.user.id, mediaType, purchasedMedia)

      return this.http.post<Purchase>(environment.LABTV_DB + "posts",
        purchased, {
        headers: new HttpHeaders({
          "Authorization": "Bearer " + theUser.accessToken
        })
      })

    } else {
      return null
    }
  }

  findItemIndb(id: number): Observable<Purchase> {
    let loggedUser = localStorage.getItem("user");
    let theUser: LoggedUser = JSON.parse(loggedUser!);

    return this.http.get<Purchase>(environment.LABTV_DB + "posts", {
      headers: new HttpHeaders({
        "Authorization": "Bearer " + theUser.accessToken
      }),
      params: {
        "id": id
      }
    })
  }

  getPurchasedList(): Observable<Purchase[]> | null {
    let loggedUser = localStorage.getItem("user");

    if (loggedUser) {
      let theUser: LoggedUser = JSON.parse(loggedUser)

      return this.http.get<Purchase[]>(environment.LABTV_DB + "posts", {
        headers: new HttpHeaders({
          "Authorization": "Bearer " + theUser.accessToken
        }),
        params: {
          "userId": theUser.user.id
        }
      })
    } else {
      return null
    }
  }

}
