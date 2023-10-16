import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { TheMovieDbService } from '../services/the-movie-db.service';
import { Purchase } from '../models/user';
import { movieDetailResponse } from '../models/movie-model';
import { tvDetailResponse } from '../models/tv-model';

@Component({
  selector: 'app-purchased-list',
  templateUrl: './purchased-list.component.html',
  styleUrls: ['./purchased-list.component.scss']
})
export class PurchasedListComponent implements OnInit{

  list:Purchase[]=[]

  constructor(
    private authService: AuthService,
    private tmdbService: TheMovieDbService
  ){}

  ngOnInit(): void {
    this.getList()
  }

  getList(){
    this.authService.getPurchasedList()?.subscribe({
      next: (res) => this.list = res,
      error: () => this.authService.setLogOut()
    })
  }

  getMediaItemAsMovie(item:Purchase): movieDetailResponse {
    return item.mediaItem as movieDetailResponse
  }

  getMediaItemAsTv(item:Purchase): tvDetailResponse {
    return item.mediaItem as tvDetailResponse
  }





}
