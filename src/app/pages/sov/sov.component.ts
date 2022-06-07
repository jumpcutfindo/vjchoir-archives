import {
  Component,
  OnInit,
} from "@angular/core";
import { SovService } from "./sov.service";
import { SymphVoices } from "src/app/music/model/SymphVoices";
import { Router } from "@angular/router";
import { NavControllerService } from "src/app/navigation/nav-controller/nav-controller.service";
import { PlayerService } from "src/app/music/player/player.service";
import { Playlist } from "src/app/music/model/Playlist";
import { Song } from "src/app/music/model/Song";
import { Title } from '@angular/platform-browser';
import { LoadingService } from 'src/app/loading/loading.service';

const SOV_TITLE = "Symphony of Voices";

@Component({
  selector: "app-sov",
  templateUrl: "./sov.component.html",
  styleUrls: ["./sov.component.scss"],
})
export class SovComponent implements OnInit {

  sovIntro;
  sovInfo: SymphVoices[];

  currActive: SymphVoices;

  constructor(
    private navControllerService: NavControllerService,
    private sovService: SovService,
    private playerService: PlayerService,
    private router: Router,
    private titleService: Title,
    private loadingService: LoadingService
  ) {
  }

  ngOnInit() {
    this.sovService.getSovIntro().subscribe(intro => this.sovIntro = intro);
    this.sovService.getSovInfo().subscribe(info => {
      this.sovInfo = info;
      this.handleFragment();
    });
    
    this.navControllerService.routerUpdates.subscribe(val => {
      this.handleFragment();
    });
    
    this.loadingService.setLoading(false);
  }

  navigateToFragment(fragmentCode) {
    let temp = this.sovInfo.filter((x) => {
      return x.abbr.includes(fragmentCode);
    });

    this.currActive = temp[0];
    window.scroll(0, 0);
  }

  playSong(playlist: Playlist, song: Song) {
    this.playerService.onSongRequest(playlist, song);
  }

  private handleFragment() {
    if (!this.router.url.includes("#")) {
      this.currActive = null;
    } else {
      const fragment = this.router.url.split("#")[1];
      for (const item of this.sovInfo) {
        if (fragment.includes(item.abbr)) {
          this.currActive = item;
          this.titleService.setTitle(this.currActive.title);
          this.loadingService.setLoading(false);
          return;
        }
      }

      this.currActive = null;
    }
    this.titleService.setTitle(SOV_TITLE);
    this.loadingService.setLoading(false);
  }
}
