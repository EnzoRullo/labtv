import { Component, OnInit } from '@angular/core';
import { Result } from '../models/trends-model';
import { TheMovieDbService } from '../services/the-movie-db.service';

@Component({
  selector: 'app-trend-list',
  templateUrl: './trend-list.component.html',
  styleUrls: ['./trend-list.component.scss']
})
export class TrendListComponent implements OnInit {
  constructor(private tmdbService: TheMovieDbService) { }

  trendsJson: Result[] = []
  page: number = 0


  ngOnInit(): void {
    this.getTrends();
  }

  getTrends() {
    this.page = 0;
    this.getServiceCall();
  }


  getServiceCall() {
    let lastPage: number

    this.page++;
    this.tmdbService.getTrends(this.page).subscribe({
      next: (res) => {
        lastPage = res.total_pages
        if (this.page <= lastPage) {
          for (const r of res.results) {
            this.trendsJson.push(r)
          };
        }
      },
      error: (err) => console.log(err),
    });
  }

  onScroll() {
    setTimeout(() => {
      this.getServiceCall();
    }, 1000)
  }

}
