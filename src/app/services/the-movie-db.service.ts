import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { trending } from '../models/trends-model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { creditsMovieResponse, movieDetailResponse, popularMovieResponse } from '../models/movie-model';
import { creditsTvResponse, popularTvResponse, seasonDetailResponse, tvDetailResponse } from '../models/tv-model';
import { searchResponse } from '../models/search-model';
import { trailerResponse } from '../models/trailer-model';

@Injectable({
  providedIn: 'root'
})


export class TheMovieDbService {



  constructor(private http: HttpClient) { }

  getTrends(p:number): Observable<trending> {
    return this.http.get<trending>(environment.TMDB_API_URL + "trending/all/day", {
      params: {
        api_key: environment.TMDB_API_KEY,
        language: "en-US",
        page: p
      }
    })
  }

  getPopularMovie(p: number): Observable<popularMovieResponse> {
    return this.http.get<popularMovieResponse>(environment.TMDB_API_URL + "movie/popular", {
      params: {
        api_key: environment.TMDB_API_KEY,
        language: "en-US",
        page: p
      }
    })
  }

  getPopularTv(p:number): Observable<popularTvResponse> {
    return this.http.get<popularTvResponse>(environment.TMDB_API_URL + "tv/popular", {
      params: {
        api_key: environment.TMDB_API_KEY,
        language: "en-US",
        page: p
      }
    })
  }

  getDetails(mediaType: string, id: number): Observable<movieDetailResponse | tvDetailResponse> {
    if (mediaType == "movie") {
      return this.http.get<movieDetailResponse>(`${environment.TMDB_API_URL}${mediaType}/${String(id)}`, {
        params: { api_key: environment.TMDB_API_KEY }
      })
    } else {
      return this.http.get<tvDetailResponse>(`${environment.TMDB_API_URL}${mediaType}/${String(id)}`, {
        params: { api_key: environment.TMDB_API_KEY }
      })
    }
  }

  getCredits(mediaType: string, id: number): Observable<creditsMovieResponse | creditsTvResponse> {
    if (mediaType == "movie") {
      return this.http.get<creditsMovieResponse>(`${environment.TMDB_API_URL}${mediaType}/${String(id)}/credits`, {
        params: { api_key: environment.TMDB_API_KEY }
      })
    } else {
      return this.http.get<creditsTvResponse>(`${environment.TMDB_API_URL}${mediaType}/${String(id)}/credits`, {
        params: { api_key: environment.TMDB_API_KEY }
      })
    }
  }

  getTvSeason(id: number, season: number): Observable<seasonDetailResponse>{
    return this.http.get<seasonDetailResponse>(`${environment.TMDB_API_URL}tv/${String(id)}/season/${String(season)}`, {
      params: { api_key: environment.TMDB_API_KEY }
    })
  }

  getSimilarTv(id: number): Observable<popularTvResponse>{
    return this.http.get<popularTvResponse>(environment.TMDB_API_URL + `tv/${String(id)}/similar`, {
      params: {
        api_key: environment.TMDB_API_KEY,
        language: "en-US",
        page: 1
      }
    })
  }

  getSimilarMovie(id: number): Observable<popularMovieResponse>{
    return this.http.get<popularMovieResponse>(environment.TMDB_API_URL + `movie/${String(id)}/similar`, {
      params: {
        api_key: environment.TMDB_API_KEY,
        language: "en-US",
        page: 1
      }
    })
  }

  search(s:string, p:number): Observable<searchResponse>{
    return this.http.get<searchResponse>(environment.TMDB_API_URL + `search/multi`, {
      params: {
        api_key: environment.TMDB_API_KEY,
        language: "en-US",
        page: p,
        query: s
      }
    })
  }

  getTrailer(mediaType: string, id: number): Observable<trailerResponse>{
    return this.http.get<trailerResponse>(environment.TMDB_API_URL + `${mediaType}/${id}/videos`, {
      params: {
        api_key: environment.TMDB_API_KEY,
        language: "en-US",
      }
    })
  }

}
