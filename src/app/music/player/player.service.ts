import { Injectable } from '@angular/core';

import { Observable, of, Subject } from 'rxjs';
import { Playlist } from '../model/Playlist';
import { Song } from '../model/Song';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {

    private playlistUpdatesSource = new Subject<any>();
    playlistUpdates = this.playlistUpdatesSource.asObservable();

    private songRequestSource = new Subject<any>();
    songRequestUpdates = this.songRequestSource.asObservable();

    constructor() { }

    onPlaylistUpdate(msg: any) {
        console.log(msg);
        this.playlistUpdatesSource.next(msg);
    }

    onSongRequest(playlist: Playlist, song: Song) {
        const request = {
            playlist: playlist,
            song: song
        }
        this.songRequestSource.next(request);
    }
}