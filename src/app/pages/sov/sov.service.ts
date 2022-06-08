import { Injectable } from "@angular/core";

import sovJSON from "../../../assets/data/sov.json";
import { Observable, of } from "rxjs";
import { Playlist, Song, SymphVoices } from "src/app/music/player/player.service";

@Injectable({
  providedIn: "root",
})
export class SovService {
  sovInfo: SymphVoices[];

  constructor() {}

  getSovInfo(): Observable<any> {
    if (this.sovInfo) {
      return of(this.sovInfo);
    }

    this.sovInfo = Array<SymphVoices>();

    for (let i = 0; i < sovJSON.sov.length; i++) {
      let jsonItem = sovJSON.sov[i];

      let tempTracks: Song[] = Array<Song>();

      for (let j = 0; j < jsonItem.repertoire.length; j++) {
        const tempJSON = jsonItem.repertoire[j];
        let tempSong: Song = <Song>{
          playlistId: jsonItem.id,
          id: j,
          title: tempJSON.name,
          composer: tempJSON.composer,
          duration: tempJSON.duration,
          src: "../assets/audio/" + jsonItem.abbr + "/" + tempJSON.mp3 + ".mp3",
          artwork: jsonItem.artwork,
          album_info: {
            title: jsonItem.title,
            abbr: jsonItem.abbr,
            id: jsonItem.id
          }
        };

        tempTracks.push(tempSong);
      }

      let repertoireDuration = 0;
      for(let j = 0; j < tempTracks.length; j ++) {
        repertoireDuration += tempTracks[j].duration;
      }

      let tempRepertoire: Playlist = <Playlist>{
        id: jsonItem.id,
        name: jsonItem.title,
        tracks: tempTracks,
        duration: repertoireDuration,
        isDefault: true
      };

      let tempSOV = <SymphVoices>{
        id: jsonItem.id,
        title: jsonItem.title,
        abbr: jsonItem.abbr,
        info: {
          date: jsonItem.info.date,
          venue: jsonItem.info.venue,
          theme: jsonItem.info.theme,
          noFirstHalf: jsonItem.info.noFirstHalf,
          noSecondHalf: jsonItem.info.noSecondHalf,
        },
        intro: jsonItem.intro,
        artwork: jsonItem.artwork,
        repertoire: tempRepertoire,
        links: jsonItem.links
      };

      this.sovInfo.push(tempSOV);
    }
    return of(this.sovInfo);
  }

  getSovIntro(): Observable<any> {
      return of(sovJSON.intro);
  }
}
