import { Component, Input, OnInit } from '@angular/core';
import { Result } from '../models/movie-model';
import { TheMovieDbService } from '../services/the-movie-db.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-popular-movies',
  templateUrl: './popular-movies.component.html',
  styleUrls: ['./popular-movies.component.scss']
})
export class PopularMoviesComponent implements OnInit {

  constructor(
    private tmdbService: TheMovieDbService,
    private route: ActivatedRoute
  ) { }

  popularMovieJson: Result[] = []
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
    this.page = 0;
    this.getServiceCallPopular();
  }

  getServiceCallPopular() {
    let lastPage: number

    this.page++
    this.tmdbService.getPopularMovie(this.page).subscribe({
      next: (res) => {
        lastPage = res.total_pages;
        if (this.page <= lastPage) {
          for (const r of res.results) {
            this.popularMovieJson.push(r)
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
        this.tmdbService.getSimilarMovie(id).subscribe({
          next: (res) => this.popularMovieJson = res.results,
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
      }, 2000)
    }
  }

}
