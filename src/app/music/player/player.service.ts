import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { Playlist, PlaylistAction, Song } from 'src/app/pages/listen/listen.service';

@Injectable({
    providedIn: 'root',
})
export class PlayerService {

    private playlistUpdatesSource = new Subject<PlaylistAction>();
    playlistUpdates = this.playlistUpdatesSource.asObservable();

    private songRequestSource = new Subject<any>();
    songRequestUpdates = this.songRequestSource.asObservable();

    constructor() { }

    onPlaylistUpdate(action: PlaylistAction) {
        this.playlistUpdatesSource.next(action);
    }

    onSongRequest(playlist: Playlist, song: Song) {
        const request = {
            playlist: playlist,
            song: song
        }
        this.songRequestSource.next(request);
    }
}