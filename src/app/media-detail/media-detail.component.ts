import { Component, OnInit } from '@angular/core';
import { TheMovieDbService } from '../services/the-movie-db.service';
import { movieCast, Genre, movieDetailResponse, Crew } from '../models/movie-model';
import { tvCast, tvDetailResponse } from '../models/tv-model';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-media-detail',
  templateUrl: './media-detail.component.html',
  styleUrls: ['./media-detail.component.scss']
})
export class MediaDetailComponent implements OnInit {
  constructor(
    private tmdbService: TheMovieDbService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {

    router.events.subscribe({
      next: (e) => {
        if (e instanceof NavigationEnd && this.mediaType && this.id) {
          this.ngOnInit();
        };
      },
      error: (err) => console.log(err)
    })

  }

  selectedMovie?: movieDetailResponse
  selectedTv?: tvDetailResponse
  mediaType?: string
  id?: number
  season?: number
  selectedGenres?: Genre[]
  voteAverage: number[] = []
  background: string = ''

  movieCast?: movieCast[]
  tvCast?: tvCast[]

  crew?: Crew[]
  producers: Crew[] = []
  directors: Crew[] = []
  writers: Crew[] = []

  seasonNumber: number[] = []

  safeUrl?: SafeUrl

  loggedIn: boolean = false
  purchased: boolean = false

  ngOnInit(): void {
    this.getRouteParam();
    this.getMediaDetails();
    this.getCredits();
    this.getTrailer();
    this.changeButton();
  }

  getRouteParam() {
    this.route.params.subscribe({
      next: (res) => {
        this.mediaType = res['mediaType'];
        this.id = Number(res['id']);
      }
    })

    this.route.firstChild?.params.subscribe({
      next: (res) => {
        this.season = Number(res['season']);
        if (res['season'] == 0) {
          this.scrollTop();
        }
      }
    })
  }

  getMediaDetails() {
    this.tmdbService.getDetails(this.mediaType!, this.id!).subscribe({
      next: (res) => {
        this.voteAverage = [];
        if (this.mediaType == "movie") {
          this.selectedMovie = res as movieDetailResponse;
          this.selectedGenres = this.selectedMovie!.genres;
          for (let s = 0; s < Math.floor(this.selectedMovie.vote_average) / 2; s++) {
            this.voteAverage.push(1)
          }
        } else {
          this.selectedTv = res as tvDetailResponse;
          this.selectedGenres = this.selectedTv!.genres;
          for (let s = 0; s < Math.floor(this.selectedTv.vote_average) / 2; s++) {
            this.voteAverage.push(1)
          }

          /*----gestione dettagli season/episodi-----*/
          this.seasonNumber = []
          for (let i = 1; i <= this.selectedTv.number_of_seasons; i++) {
            this.seasonNumber.push(i)
          };
        };
      },
      error: (err) => console.log(err)
    })
  }

  getCredits() {
    this.tmdbService.getCredits(this.mediaType!, this.id!).subscribe({
      next: (res) => {
        if (this.mediaType == "movie") {
          this.movieCast = res.cast as movieCast[];
        } else {
          this.tvCast = res.cast as tvCast[];
        };
        this.crew = res.crew as Crew[];
        this.crew.sort((a, b) => a.popularity > b.popularity ? -1 : 1);
        this.producers = this.crew.filter(p => p.job.includes("Producer"));
        this.producers = this.eliminatesDuplicates(this.producers);
        this.directors = this.crew.filter(d => d.job.includes("Director"));
        this.directors = this.eliminatesDuplicates(this.directors);
        this.writers = this.crew.filter(w => w.department == "Writing");
        this.writers = this.eliminatesDuplicates(this.writers);
      },
      error: (err) => console.log(err)
    })
  }

  eliminatesDuplicates(value: any[]): any[] {
    let cleanArr = [];
    for (const i of value) {
      if (cleanArr.some(e => e.id == i.id) == false) {
        cleanArr.push(i);
      }
    }
    return cleanArr;
  }

  getTrailer() {
    let ytKey: string | undefined
    this.tmdbService.getTrailer(this.mediaType!, this.id!).subscribe({
      next: (res) => {
        ytKey = res.results.find(a => a.type == "Trailer")?.key;
        if (ytKey != undefined) {
          this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${ytKey}?controls=1&enablejsapi=1&rel=0&autoplay=0`)
        } else {
          this.safeUrl = undefined;
        }
      },
      error: (err) => console.log(err)
    })
  }

  purchase() {
    if (this.loggedIn == false) {
      this.router.navigate(["/login"]);
      return
    };

    if (this.mediaType) {
      this.authService.purchase(this.mediaType, this.mediaType == "movie" ? this.selectedMovie! : this.selectedTv!)?.subscribe({
        next: () => this.changeButton(),
        error: () => this.authService.setLogOut()
      });
    }
  }

  changeButton() {
    this.loggedIn = this.authService.isUserLoggedIn();

    this.authService.getPurchasedList()?.subscribe({
      next: (res) => {
        let itemMatch = res.find(m => m.mediaItem.id == this.id);

        if (itemMatch == undefined) {
          this.purchased = false
        } else {
          this.purchased = true
        }
      },
      error: () => this.authService.setLogOut()
    })
  }

  scrollTop() {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'auto'
    })
  }
}
