import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { HomeComponent } from "../pages/home/home.component";
import { AboutComponent } from "../pages/about/about.component";
import { BatchesComponent } from "../pages/batches/batches.component";
import { SovComponent } from "../pages/sov/sov.component";
import { ListenComponent } from "../pages/listen/listen.component";
import { ContributeComponent } from "../pages/contribute/contribute.component";
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
  {
    path: 'about',
    component: AboutComponent
  },
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
    path: 'contribute',
    component: ContributeComponent
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
