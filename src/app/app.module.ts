import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { HomeComponent } from './home/home.component';
import { TrendListComponent } from './trend-list/trend-list.component';
import { PopularMoviesComponent } from './popular-movies/popular-movies.component';
import { PopularTvComponent } from './popular-tv/popular-tv.component';
import { MediaDetailComponent } from './media-detail/media-detail.component';
import { SeasonDetailComponent } from './season-detail/season-detail.component';
import { SearchComponent } from './search/search.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LoginComponent } from './login/login.component';
import { PurchasedListComponent } from './purchased-list/purchased-list.component';




@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    HomeComponent,
    TrendListComponent,
    PopularMoviesComponent,
    PopularTvComponent,
    MediaDetailComponent,
    SeasonDetailComponent,
    SearchComponent,
    LoginComponent,
    PurchasedListComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    InfiniteScrollModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
