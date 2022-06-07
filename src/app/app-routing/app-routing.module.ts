import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { HomeComponent } from "../pages/home/home.component";
import { AboutComponent } from "../pages/about/about.component";
import { BatchesComponent } from "../pages/batches/batches.component";
import { SovComponent } from "../pages/sov/sov.component";
import { ListenComponent } from "../pages/listen/listen.component";
import { MiscComponent } from "../pages/misc/misc.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home', pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  { path: 'about', redirectTo: 'about/archival', pathMatch: 'full' },
  { path: 'about/archival', component: AboutComponent },
  { path: 'about/choir', component: AboutComponent },
  { path: 'about/conductor', component: AboutComponent },
  { path: 'about/contributors', component: AboutComponent },
  { path: 'about/contributing', component: AboutComponent },
  {
    path: 'batches',
    component: BatchesComponent
  },
  {
    path: 'sov',
    component: SovComponent
  },
  {
    path: 'listen',
    component: ListenComponent
  },
  {
    path: 'misc',
    component: MiscComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
