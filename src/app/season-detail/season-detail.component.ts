import { Component, Input, OnInit } from '@angular/core';
import { TheMovieDbService } from '../services/the-movie-db.service';
import { Episode, seasonDetailResponse } from '../models/tv-model';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-season-detail',
  templateUrl: './season-detail.component.html',
  styleUrls: ['./season-detail.component.scss']
})
export class SeasonDetailComponent implements OnInit {

  seasonEp?: seasonDetailResponse
  episodes?: Episode[]

  idParam?: number
  seasonParam?: number

  constructor(
    private tmdbService: TheMovieDbService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    router.events.subscribe({
      next: (e) => {
        if (e instanceof NavigationEnd) {
          this.getParams();
          this.getSeasonDetail()
        }
      },
      error: (err) => console.log(err)
    })
  }

  ngOnInit(): void {
    this.getParams();
    this.getSeasonDetail()
  }

  getParams() {
    this.route.parent!.params.subscribe({
      next: (param) => this.idParam = Number(param['id']),
      error: (err) => console.log(err)
    });

    this.route.params!.subscribe({
      next: (p) => {
        this.seasonParam = Number(p['season']);
        if(this.seasonParam === 0) {this.seasonParam = 1}
      },
      error: (err) => console.log(err)
    })
  }

  getSeasonDetail() {
    this.tmdbService.getTvSeason(this.idParam!, this.seasonParam!).subscribe({
      next: (res) => {
        this.seasonEp = res,
          this.episodes = res.episodes
      },
      error: (err) => console.log(err)
    })
  }

}
