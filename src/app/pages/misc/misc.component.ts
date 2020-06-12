import { Component, OnInit } from '@angular/core';
import { MiscService } from './misc.service';
import { UpdateLog } from './model/UpdateLog';
import { Router } from '@angular/router';
import { NavControllerService } from 'src/app/navigation/nav-controller/nav-controller.service';
import { Title } from '@angular/platform-browser';
import { LoadingService } from 'src/app/loading/loading.service';

const MISC_TITLE = "Miscellaneous";

@Component({
  selector: 'app-misc',
  templateUrl: './misc.component.html',
  styleUrls: ['./misc.component.scss']
})
export class MiscComponent implements OnInit {

  updateLog: UpdateLog[];
  miscJSON;

  currActive;

  constructor(private miscService: MiscService, 
    private navControllerService: NavControllerService, 
    private router: Router,
    private titleService: Title,
    private loadingService: LoadingService) { }

  ngOnInit() {
    this.miscService.getUpdateLog().subscribe(updateLog => this.updateLog = updateLog);
    this.miscService.getContent().subscribe(miscJSON => {
      this.miscJSON = miscJSON
      this.handleFragment();
    });

    this.navControllerService.routerUpdates.subscribe(val => {
      this.handleFragment();
    });
  }

  private handleFragment() {
    if (!this.router.url.includes("#")) {
      this.currActive = this.miscJSON.sections[0];
    } else {
      let fragment = this.router.url.split("#")[1];
      for (let item of this.miscJSON.sections) {
        if (fragment.includes(item.id)) {
          this.currActive = item;
          this.titleService.setTitle(this.currActive.title);
          this.loadingService.setLoading(false);
          return;
        }
      }
    }
    this.titleService.setTitle(MISC_TITLE);
    this.loadingService.setLoading(false);
  }
}
