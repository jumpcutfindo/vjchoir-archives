import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

export interface SymphVoices {
    id: number;
    title: string;
    abbr: string;
    info: {
        date: string;
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
    duration?: any;
    isOpen?: boolean;
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
    CREATE_PLAYLIST, DELETE_PLAYLIST, ADD_SONG, DELETE_SONG
}

export interface PlaylistAction {
    type: PlaylistActionType,
    playlist: Playlist,
}

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