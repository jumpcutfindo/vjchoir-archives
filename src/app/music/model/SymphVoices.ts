import { Playlist } from './Playlist';

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