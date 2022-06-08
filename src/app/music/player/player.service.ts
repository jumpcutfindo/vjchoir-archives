import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { Playlist, PlaylistAction, Song } from 'src/app/pages/listen/listen.service';

@Injectable({
    providedIn: 'root',
})
export class PlayerService {
    private songRequestSource = new Subject<any>();
    songRequestUpdates = this.songRequestSource.asObservable();

    constructor() { }

    onSongRequest(playlist: Playlist, song: Song) {
        const request = {
            playlist: playlist,
            song: song
        }
        this.songRequestSource.next(request);
    }
}