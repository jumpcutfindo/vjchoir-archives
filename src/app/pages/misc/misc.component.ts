import { Component, OnInit } from '@angular/core';
import { MiscService, UpdateLog } from './misc.service';
import { ActivatedRoute } from '@angular/router';
import { LoadingService } from 'src/app/loading/loading.service';
import { combineLatest } from 'rxjs';
import { NavControllerService } from 'src/app/navigation/nav-controller/nav-controller.service';

@Component({
  selector: 'app-misc',
  templateUrl: './misc.component.html',
  styleUrls: ['./misc.component.scss']
})
export class MiscComponent implements OnInit {

  updateLog: UpdateLog[];
  miscJSON;

  currActive;

  constructor(
    private activatedRoute: ActivatedRoute,
    private miscService: MiscService, 
    private loadingService: LoadingService,
    private navControllerService: NavControllerService) { }

  ngOnInit() {
    this.miscService.getUpdateLog().subscribe(updateLog => this.updateLog = updateLog);

    combineLatest([this.miscService.getContent(), this.activatedRoute.url]).subscribe(([miscData, urlData]) => {
      this.miscJSON = miscData;
      this.setSection(urlData[1].path);
    })
    
    this.loadingService.setLoading(false);
  }

  setSection(id: string): void {
    this.currActive = this.miscJSON.sections.find(section => section.id === id);
    this.navControllerService.setNavTitle("Miscellaneous");
    this.navControllerService.setWindowTitle(this.currActive.title);
  }
}
