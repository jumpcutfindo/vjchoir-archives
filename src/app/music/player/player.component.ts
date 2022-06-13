import { Component, OnInit, ViewChild, Output, EventEmitter } from "@angular/core";
import { PlyrComponent } from "ngx-plyr";
import { SovService } from "src/app/pages/sov/sov.service";
import { NavControllerService } from 'src/app/navigation/nav-controller/nav-controller.service';
import { ListenService, Playlist, PlaylistActionType, Song, SymphVoices } from 'src/app/pages/listen/listen.service';
import { PlayerService } from './player.service';

const PLAYLISTS_DEFAULT_TITLE = "Playlists";

@Component({
  selector: "app-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.scss"],
})
export class PlayerComponent implements OnInit {
  @ViewChild(PlyrComponent)
  plyr: PlyrComponent;

  @Output() linkClickEmitter = new EventEmitter();

  sovInfo: any;
  myPlaylists: Playlist[];
  playlists: Playlist[] = [];

  isMinimised: boolean;
  isPlaying = false;
  isCanPlay = false;
  isBuffering = true;

  activeWindowTitle: string;
  currDisplayedPlaylist: Playlist;
  currDisplayedPlaylistId: number;

  currActivePlaylist: Playlist;
  nowPlaying: Song;
  nowPlayingHasNext: boolean;
  nowPlayingHasPrev: boolean;

  playerPlaylistsWindow: HTMLElement;

  audioSources: Plyr.Source[] = [];

  constructor(private navController: NavControllerService, private sovService: SovService, private listenService: ListenService, private playerService: PlayerService) {
    // Update personal playlists whenever there is an edit made to personal playlists
    this.listenService.playlistUpdates.subscribe(val => {
      this.loadPlaylists();
    });

    // TODO: Remove this an integrate into the player actions
    this.playerService.songRequestUpdates.subscribe(val => {
      // this.loadSong(val.playlist, val.song, true);
    })

    // TODO: Remove this an integrate into the player actions
    this.navController.clickedSong.subscribe(val => {
      this.loadSongViaId(val.playlistId, val.id, true);
    });

    this.loadPlaylists();
  }

  ngOnInit() {
    // Setup layout settings
    this.activeWindowTitle = PLAYLISTS_DEFAULT_TITLE;
    this.isMinimised = true;
    this.playerPlaylistsWindow = document.getElementById("player-playlists");

    // Load the default song
    this.loadSongViaId(0, 0, false);
  }

  /**
   * Loads both the default playlists and personal playlists, and combines them
   * into a single array to ensure correct indexing.
   */
  loadPlaylists(): void {
    this.sovService.getSovInfo().subscribe((info) => {
      this.sovInfo = info
    });

    this.listenService.getPlaylists().subscribe(playlists => {
      this.myPlaylists = playlists;
    });

    this.playlists = [];
    for (const sov of this.sovInfo) {
      this.playlists.push(sov.repertoire);
    }    
    for (const playlist of this.myPlaylists) {
      this.playlists.push(playlist);
    }
  }

  /**
   * Displays the provided playlist on the player.
   */
  displayPlaylist(playlist: Playlist) {
    this.currDisplayedPlaylist = playlist;
    this.currDisplayedPlaylistId = this.playlists.indexOf(playlist);
    this.activeWindowTitle = playlist.name;
    this.playerPlaylistsWindow.scroll(0, 0);
  }

  /**
   * Returns the user to the main menu of the player.
   */
  onBackClick() {
    this.currDisplayedPlaylist = null;
    this.activeWindowTitle = PLAYLISTS_DEFAULT_TITLE;
    this.playerPlaylistsWindow.scroll(0, 0);
  }

  /**
   * Retrieves the default playlists.
   */
  getDefaultPlaylists(): Playlist[] {
    return this.sovInfo.map(info => info.repertoire);
  }

  /**
   * Retrieves the personal playlists.
   */
  getMyPlaylists(): Playlist[] {
    return this.myPlaylists;
  }

  /**
   * Loads via the playlist id (index in the playlists array), song id (index in the song array).
   */
   loadSongViaId(playlistId: number, songId: number, isPlayOnLoad = true): void {
    const playlist = this.playlists[playlistId];
    const song = playlist.tracks[songId];

    console.log("Loading '" + song.title + "' of playlist '" + playlist.name + "'");
    this.audioSources = [
      {
        src: song.src,
        type: "audio/mp3",
      },
    ];
    
    this.nowPlaying = song;
    this.currActivePlaylist = playlist;
    this.isCanPlay = isPlayOnLoad;

    const songIndex = playlist.tracks.indexOf(song);
    this.nowPlayingHasNext = songIndex + 1 < playlist.tracks.length;
    this.nowPlayingHasPrev = songIndex - 1 >= 0;
  }

  /**
   * Loads the next song in the current playlist.
   */
  loadNextSong(): void {
    const currPlaylistIndex = this.playlists.indexOf(this.currActivePlaylist);
    const currSongIndex = this.currActivePlaylist.tracks.indexOf(this.nowPlaying);

    let nextSongIndex = currSongIndex + 1;

    // Loop back to the start if this is the last song
    if(nextSongIndex >= this.currActivePlaylist.tracks.length) {
      nextSongIndex = 0;
    }

    this.loadSongViaId(currPlaylistIndex, nextSongIndex, true);
  }

  /**
   * Loads the previous song in the current playlist.
   */
  loadPrevSong(): void {
    const currPlaylistIndex = this.playlists.indexOf(this.currActivePlaylist);
    const currSongIndex = this.currActivePlaylist.tracks.indexOf(this.nowPlaying);
    let prevSongIndex = currSongIndex - 1;

    if(prevSongIndex < 0) {
      prevSongIndex = 0;
    }

    this.loadSongViaId(currPlaylistIndex, prevSongIndex, true);
  }

  onPlayClick(event) {
    event.stopPropagation();
    if(this.isPlaying) {
      this.plyr.player.pause();
    } else {
      this.plyr.player.play();
    }
  }

  onNextClick(event) {
    event.stopPropagation();
    this.loadNextSong();
  }

  onPrevClick(event) {
    event.stopPropagation();
    this.loadPrevSong();
  }

  onCanPlay() {
    if(this.isCanPlay) {
      this.plyr.player.play();
    }
  }

  onLinkClick(link: string) {
    this.navController.onLinkClick(link);

    if(window.innerWidth < 1024) {
      if(this.navController.getIsSidebarActive()) {
        this.navController.toggleSidebar();
      }
      this.isMinimised = !this.isMinimised;
    }
  }
}
