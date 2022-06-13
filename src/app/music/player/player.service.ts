import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { Playlist, PlaylistAction, Song } from 'src/app/pages/listen/listen.service';

export enum PlayerActionTypes {
    PLAY, PAUSE, PREVIOUS, NEXT, SELECT_SONG
}

export interface PlayerAction {
    type: PlayerActionTypes,
    playlist: Playlist,
    song: Song,
}

@Injectable({
    providedIn: 'root',
})
export class PlayerService {
    private playerUpdatesSource = new Subject<PlayerAction>();
    playerUpdates = this.playerUpdatesSource.asObservable();

    onPlayerAction(action: PlayerAction): void {
        this.playerUpdatesSource.next(action);
    }

    requestSong(playlist: Playlist, song: Song): void {
        this.onPlayerAction({ type: PlayerActionTypes.SELECT_SONG, playlist, song });
    }
}