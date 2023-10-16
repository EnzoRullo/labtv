import { Component, OnInit } from '@angular/core';
import { TheMovieDbService } from '../services/the-movie-db.service';
import { Result } from '../models/search-model';
import { searchStrExp } from '../nav-bar/nav-bar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchResults: Result[] = []
  searchTitle?: string
  page: number = 0

  constructor(
    private tmdbService: TheMovieDbService,
    private router: Router
    ) {
    document.getElementById('searchButton')?.addEventListener('click', () => this.getSearch())
  }

  ngOnInit(): void {
    this.getSearch();
    if(searchStrExp== ""){
      this.router.navigate(['home'])
    }

  }

  searchServiceCall(t: string) {
    let lastPage: number

    this.page++;
    this.tmdbService.search(t, this.page).subscribe({
      next: (res) => {
        lastPage = res.total_pages;

        let filteredRes: Result[] = res.results.filter(m => m.media_type == "movie" || m.media_type == "tv");
        let peopleRes: Result[] = res.results.filter(p => p.known_for);

        for (const singleRes of filteredRes) { this.searchResults.push(singleRes) };
        for (const peopleWorks of peopleRes) {
          for (const works of peopleWorks.known_for!) { this.searchResults.push(works as Result); }
        };
        if (this.page <= lastPage) { this.searchServiceCall(t) };
      },
      error: (err) => console.log(err),
      complete: () => {
        this.searchResults.sort((a, b) => a.popularity > b.popularity ? -1 : 1)
      }
    })

  }

  getSearch() {
    let searchStr: string;

    this.page = 0
    this.searchResults = []
    setTimeout(() => {
      this.searchTitle = searchStrExp
      searchStr = searchStrExp
      if (searchStr.trim().length != 0) {
        this.searchServiceCall(searchStr);
      }
    }, 1)// set timeout permette a searchStr di aggiornarsi con il nuovo valore
  }
}
