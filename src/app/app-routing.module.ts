import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MediaDetailComponent } from './media-detail/media-detail.component';
import { SeasonDetailComponent } from './season-detail/season-detail.component';
import { SearchComponent } from './search/search.component';
import { LoginComponent } from './login/login.component';
import { PurchasedListComponent } from './purchased-list/purchased-list.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  
  {
    path: ":mediaType/:id", component: MediaDetailComponent,
    children: [
      { path: ":season", component: SeasonDetailComponent }
    ]
  },
  { path: "search", component: SearchComponent },
  { path: "login", component: LoginComponent},
  { path: "collection", component: PurchasedListComponent, canActivate: [AuthGuard] },
  { path: "home", component: HomeComponent },
  { path: "",redirectTo: "/home", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
