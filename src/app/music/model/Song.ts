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