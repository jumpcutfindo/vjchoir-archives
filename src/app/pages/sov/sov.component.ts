import {
  Component,
  OnInit,
} from "@angular/core";
import { SovService } from "./sov.service";
import { ActivatedRoute } from "@angular/router";
import { PlayerService } from "src/app/music/player/player.service";
import { LoadingService } from 'src/app/loading/loading.service';
import { combineLatest } from "rxjs";
import { SymphVoices, Playlist, Song } from "../listen/listen.service";
import { NavControllerService } from "src/app/navigation/nav-controller/nav-controller.service";

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
    private activatedRoute: ActivatedRoute,
    private sovService: SovService,
    private playerService: PlayerService,
    private loadingService: LoadingService,
    private navControllerService: NavControllerService
  ) {
  }

  ngOnInit() {
    this.sovService.getSovIntro().subscribe(intro => this.sovIntro = intro);

    combineLatest([this.sovService.getSovInfo(), this.activatedRoute.url]).subscribe(([sovData, urlData]) => {
      this.sovInfo = sovData;
      
      this.setSection(urlData[1].path);
    });

    this.sovService.getSovInfo().subscribe(info => {
      this.sovInfo = info;
    });
    
    this.loadingService.setLoading(false);
  }

  setSection(id: string): void {
    this.currActive = this.sovInfo.find(sov => sov.id.toString() === id);

    const title = !this.currActive ? "Symphony of Voices" : this.currActive.title;
    this.navControllerService.setNavTitle("Symphony of Voices");
    this.navControllerService.setWindowTitle(title);
  }

  playSong(playlist: Playlist, song: Song) {
    this.playerService.requestSong(playlist, song);
  }
}
