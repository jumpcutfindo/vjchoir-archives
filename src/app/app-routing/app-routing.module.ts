import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { HomeComponent } from "../pages/home/home.component";
import { AboutComponent } from "../pages/about/about.component";
import { BatchesComponent } from "../pages/batches/batches.component";
import { SovComponent } from "../pages/sov/sov.component";
import { ListenComponent } from "../pages/listen/listen.component";
import { MiscComponent } from "../pages/misc/misc.component";
import { PageNotFoundComponent } from "../pages/page-not-found/page-not-found.component";

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
  
  { path: 'batches', redirectTo: 'batches/home', pathMatch: 'full' },
  { path: 'batches/home', component: BatchesComponent },
  { path: 'batches/2022', component: BatchesComponent },
  { path: 'batches/2021', component: BatchesComponent },
  { path: 'batches/2020', component: BatchesComponent },
  { path: 'batches/2019', component: BatchesComponent },
  { path: 'batches/2018', component: BatchesComponent },
  { path: 'batches/2017', component: BatchesComponent },
  { path: 'batches/2016', component: BatchesComponent },
  { path: 'batches/2015', component: BatchesComponent },
  { path: 'batches/2014', component: BatchesComponent },

  { path: 'sov', redirectTo: 'sov/home', pathMatch: 'full' },
  { path: 'sov/home', component: SovComponent },
  { path: 'sov/2019', component: SovComponent },
  { path: 'sov/2018', component: SovComponent },
  { path: 'sov/2017', component: SovComponent },
  { path: 'sov/2016', component: SovComponent },
  { path: 'sov/2015', component: SovComponent },
  { path: 'sov/2014', component: SovComponent },
  { path: 'sov/2013', component: SovComponent },
  { path: 'sov/2012', component: SovComponent },
  { path: 'sov/2010', component: SovComponent },
  { path: 'sov/2008', component: SovComponent },
  { path: 'sov/2007', component: SovComponent },
  
  {
    path: 'listen',
    component: ListenComponent
  },

  { path: 'misc', redirectTo: 'misc/main', pathMatch: 'full' },
  { path: 'misc/main', component: MiscComponent },
  { path: 'misc/updates', component: MiscComponent },
  { path: 'misc/faq', component: MiscComponent },

  {
    path: '**', component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class AppRoutingModule {}
