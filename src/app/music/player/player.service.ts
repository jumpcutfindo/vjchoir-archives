import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { Playlist, PlaylistAction, Song } from 'src/app/pages/listen/listen.service';

export enum PlayerActionTypes {
    PLAY, PAUSE, PREVIOUS, NEXT, SELECT_SONG
};

@Injectable({
    providedIn: 'root',
})
export class PlayerService {
    // TODO: Create a proper class for these observables
    private playerUpdatesSource = new Subject<any>();
    playerUpdates = this.playerUpdatesSource.asObservable();

    private songRequestSource = new Subject<any>();
    songRequestUpdates = this.songRequestSource.asObservable();

    onSongRequest(playlist: Playlist, song: Song) {
        const request = {
            playlist: playlist,
            song: song
        }
        this.songRequestSource.next(request);
    }
}