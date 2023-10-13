import { Injectable } from "@angular/core";

import listenJSON from "../../../assets/data/listen.json";

import { Observable, of, Subject } from "rxjs";
import { SovService } from '../sov/sov.service';
import { isNumber } from "@ng-bootstrap/ng-bootstrap/util/util";
import { _isNumberValue } from "@angular/cdk/coercion";

const MY_PLAYLISTS_STRING = "myPlaylists";

const DEFAULT_TITLE = "Imported playlist";
const DEFAULT_DESCRIPTION = "This playlist was imported on " + new Date().toISOString();

const PLAYLIST_SEPARATOR = "p";
const TRACKS_SEPARATOR = "t";
const SONG_SEPARATOR = "s";
const POS_SEPARATOR = "i";

export interface SymphVoices {
  id: number;
  title: string;
  abbr: string;
  info: {
      date: number;
      venue: string;
      theme: string;
      noFirstHalf: number;
      noSecondHalf: number;
  }
  intro?: string;
  artwork: string;
  repertoire: Playlist;
  links?: any;
}

export interface Playlist {
  id?: number;
  tracks: Song[];
  name?: string;
  desc?: string;
  duration?: number;
  isDefault?: boolean;
}

export interface Song {
  playlistId: number;
  id: number;
  title: string;
  desc?: string;
  src: string;
  composer?: string;
  duration: any;
  artwork?: string;
  album_info?: {
      title: string;
      abbr: string;
      id: number;
  }
}

export enum PlaylistActionType {
  CREATE_PLAYLIST, DELETE_PLAYLIST, UPDATE_PLAYLIST_HEADERS, ADD_SONG, DELETE_SONG
}

export interface PlaylistAction {
  type: PlaylistActionType,
  playlists: Playlist[],
}

/**
 * Honestly this should be called "PlaylistService" but too late.
 * This service handles all playlist related actions and information retrieval.
 */
@Injectable({
  providedIn: "root",
})
export class ListenService {
  // Observable for any playlist related actions taken
  private playlistUpdatesSource = new Subject<PlaylistAction>();
  playlistUpdates = this.playlistUpdatesSource.asObservable();

  myPlaylists: Playlist[];
  sovInfo: any;

  constructor(private sovService: SovService) {
    this.sovService.getSovInfo().subscribe(info => {
      this.sovInfo = info
      this.getLocalPlaylists();
    });
  }

  /**
   * Loads any locally saved playlists.
   */
  private getLocalPlaylists(): void {
    const json = localStorage.getItem(MY_PLAYLISTS_STRING);
    console.log("Loading any saved playlists...");

    if (!json || json == "") {
      this.myPlaylists = [];
    } else {
      this.myPlaylists = JSON.parse(json);
      this.myPlaylists = this.myPlaylists.map(playlistJSON => {
        return this.jsonToPlaylist(playlistJSON);
      });

      this.savePlaylists(this.myPlaylists);
    }
    console.log("Loaded " + this.myPlaylists.length + " saved playlists!");
  }

  getHeader(): Observable<any> {
    return of(listenJSON.header);
  }

  getPlaylists(): Observable<Playlist[]> {
    return of(this.myPlaylists);
  }

  /**
   * Saves any playlists created to local storage
   */
  private savePlaylists(myPlaylists: Playlist[]): void {
    const json = JSON.stringify(myPlaylists);
    console.log("Saving playlists...");
    localStorage.setItem(MY_PLAYLISTS_STRING, json);
  }

  /**
   * Generates a new, empty playlist to be edited by the user
   */
  createNewPlaylist(): Playlist  {
    return {
      name: "Default playlist name",
      desc: "Default description name",
      duration: 0,
      tracks: [],
      isDefault: false
    };
  }

  /**
   * Dispatches the action to the observable. The provided playlists in the action
   * contains the latest updated set of playlists, so we make sure to save it.
   */
  onPlaylistUpdate(action: PlaylistAction) {
    this.playlistUpdatesSource.next(action);
    this.savePlaylists(this.myPlaylists);
  }

  /**
   * Deletes all playlists from the local storage
   */
  resetStorage() {
    localStorage.setItem(MY_PLAYLISTS_STRING, "");
    console.log("Storage has been reset!");

    this.myPlaylists = [];
  }

  /**
   * Converts a stored JSON playlist to one usable by the system
   */
  jsonToPlaylist(playlist: any): Playlist {
    playlist.isOpen = false;

    // This method handles the situation where an old version of the website with
    // older playlists is accessing the new website (due to the time change from a
    // number to a string)
    if (!_isNumberValue(playlist.duration)) {
      console.log("Uh-oh! Looks like your saved playlist is using an old format, please hold while we update...");
      const code: string = this.playlistToParameters(playlist);
      const fixedPlaylist: Playlist = this.parametersToPlaylist(code);

      fixedPlaylist.name = playlist.name;
      fixedPlaylist.desc = playlist.desc;
      return fixedPlaylist;
    }

    return playlist;
  }

  /**
   * Converts some generated code parameters into a playlist
   */
  parametersToPlaylist(code: string): Playlist {
    try {
      const params = [];
      const playlistParams = code.split(PLAYLIST_SEPARATOR);
      playlistParams.shift();
      for(const playlistParam of playlistParams) {
        const plIdAndTracks = playlistParam.split(TRACKS_SEPARATOR);
        const plId = plIdAndTracks[0];
        const tracks = plIdAndTracks[1].split(SONG_SEPARATOR);
        tracks.shift();

        for(const track of tracks) {
          const trackInfo = track.split(POS_SEPARATOR);
          const trackId = trackInfo[0];
          const pos = trackInfo[1];

          params.push({
            pl_id: plId,
            id: trackId,
            pos: pos
          })
        }
      }

      const songs = params.map(param => {
        const sov = this.sovInfo.filter(x => x.id == parseInt(param.pl_id))[0];
        const song = sov.repertoire.tracks[parseInt(param.id)];

        return {
          pos: param.pos,
          song: song
        }
      });

      const playlist: Playlist = {
        name: DEFAULT_TITLE,
        desc: DEFAULT_DESCRIPTION,
        tracks: songs.sort((a, b) => a.pos - b.pos).map(x => x.song)
      }

      let repertoireDuration = 0;
      for(let j = 0; j < playlist.tracks.length; j ++) {
        repertoireDuration += playlist.tracks[j].duration;
      }

      playlist.duration = repertoireDuration;
      
      return playlist;
    } catch(e) {
      console.log("Unable to import playlist; returning a default one");
      return this.createNewPlaylist();
    }
  }

  /**
   * Converts a playlist into generated code parameters
   */
  playlistToParameters(playlist: Playlist): string {
    const tracks = playlist.tracks;
    const plIds = [];
    const params = [];

    let output = '';

    for(let i = 0; i < tracks.length; i ++) {
      const song = tracks[i];
      const param = {
        pl_pos: i.toString(),
        id: song.id.toString(),
        pl_id: song.album_info.id,
      }

      if(param.pl_pos.length != 2) {
        param.pl_pos = '0' + param.pl_pos;
      }

      if(param.id.length != 2) {
        param.id = '0' + param.id;
      }

      params.push(param);

      if(!plIds.includes(param.pl_id)) {
        plIds.push(param.pl_id);
      }
    }

    for(const plId of plIds) {
      let str = ''
      str +=(PLAYLIST_SEPARATOR + plId + TRACKS_SEPARATOR);

      const songsWithThisId = params.filter(x => x.pl_id == plId);

      for(const song of songsWithThisId) {
        str += SONG_SEPARATOR + song.id + POS_SEPARATOR + song.pl_pos;
      }

      output += str;
    }

    return output;
  }
}
