import { Component, Input, OnInit } from '@angular/core';
import { TheMovieDbService } from '../services/the-movie-db.service';
import { Result } from '../models/tv-model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-popular-tv',
  templateUrl: './popular-tv.component.html',
  styleUrls: ['./popular-tv.component.scss']
})
export class PopularTvComponent implements OnInit {

  constructor(
    private tmdbService: TheMovieDbService,
    private route: ActivatedRoute
  ) { }

  popularTvJson: Result[] = []
  @Input() similarList: boolean = false
  page: number = 0

  ngOnInit(): void {
    if (!this.similarList) {
      this.getPopular()
    } else {
      this.getSimilar()
    }

  }

  getPopular() {
    this.page = 0
    this.getServiceCallPopular()
  }


  getServiceCallPopular() {
    let lastPage: number

    this.page++
    this.tmdbService.getPopularTv(this.page).subscribe({
      next: (res) => {
        lastPage = res.total_pages
        if (this.page <= lastPage) {
          for (const r of res.results) {
            this.popularTvJson.push(r);
          }
        }
      },
      error: (err) => console.log(err)
    })
  }

  getSimilar() {
    let id: number
    this.route.params.subscribe({
      next: (p) => {
        id = Number(p['id'])
        this.tmdbService.getSimilarTv(id).subscribe({
          next: (res) => this.popularTvJson = res.results,
          error: (err) => console.log(err)
        })
      },
      error: (err) => console.log(err, "Param error")
    })
  }

  onScroll() {
    if (!this.similarList) {
      setTimeout(() => {
        this.getServiceCallPopular();
      }, 1000)
    }
  }

}
