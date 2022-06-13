import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SidebarComponent } from './navigation/sidebar/sidebar.component';
import { NavbarComponent } from './navigation/navbar/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { BatchesComponent } from './pages/batches/batches.component';
import { SovComponent } from './pages/sov/sov.component';
import { ListenComponent } from './pages/listen/listen.component';
import { MiscComponent } from './pages/misc/misc.component';
import { NavControllerComponent } from './navigation/nav-controller/nav-controller.component';
import { AppendNamesPipe } from './pipes/append-names.pipe';
import { SafePipe } from './pipes/safe-link-pipe';
import { PlayerComponent } from './music/player/player.component';
import { FormatDurationPipe } from './pipes/format-duration.pipe';
import { LoadingComponent } from './loading/loading.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlyrModule } from 'ngx-plyr';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgbCarouselModule, NgbDropdownModule, NgbModalModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { NgxSplideModule } from 'ngx-splide';
import { ToastrModule } from 'ngx-toastr';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PerformanceComponent } from './pages/performance/performance.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    HomeComponent,
    AboutComponent,
    BatchesComponent,
    SovComponent,
    ListenComponent,
    MiscComponent,
    NavControllerComponent,
    PlayerComponent,
    AppendNamesPipe,
    SafePipe,
    FormatDurationPipe,
    LoadingComponent,
    PageNotFoundComponent,
    PerformanceComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CommonModule,
    RouterModule,
    PlyrModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    AppRoutingModule,
    NgbCarouselModule,
    NgbModalModule,
    NgbDropdownModule,
    NgbTooltipModule,
    MatSlideToggleModule,
    DragDropModule,
    ClipboardModule,
    NgxSplideModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-center',
      preventDuplicates: true
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
