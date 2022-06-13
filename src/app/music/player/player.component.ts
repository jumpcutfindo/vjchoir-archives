import { Component, OnInit, ViewChild, Output, EventEmitter } from "@angular/core";
import { PlyrComponent } from "ngx-plyr";
import { SovService } from "src/app/pages/sov/sov.service";
import { NavControllerService } from 'src/app/navigation/nav-controller/nav-controller.service';
import { ListenService, Playlist, PlaylistActionType, Song, SymphVoices } from 'src/app/pages/listen/listen.service';
import { PlayerActionTypes, PlayerService } from './player.service';

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

    this.initPlayerUpdateListener();
    this.loadPlaylists();
  }

  ngOnInit() {
    // Setup layout settings
    this.activeWindowTitle = PLAYLISTS_DEFAULT_TITLE;
    this.isMinimised = false;
    this.playerPlaylistsWindow = document.getElementById("player-playlists");

    // Load the default song
    this.loadSongViaId(0, 0, false);
  }

  /**
   * Instantiates the listener for any relevant player updates. Actions will
   * go through the serivce and dispatched to the component for relevant
   * updates.
   */
  initPlayerUpdateListener(): void {
    this.playerService.playerUpdates.subscribe(action => {
      let playlistId;
      switch (action.type) {
      case PlayerActionTypes.PLAY:
        this.play();
        break;
      case PlayerActionTypes.PAUSE:
        this.pause();
        break;
      case PlayerActionTypes.NEXT:
        this.loadNextSong();
        break;
      case PlayerActionTypes.PREVIOUS:
        this.loadPrevSong();
        break;
      case PlayerActionTypes.SELECT_SONG:
        playlistId = this.playlists.indexOf(action.playlist);
        this.loadSongViaId(playlistId, this.playlists[playlistId].tracks.indexOf(action.song));
        break;
      }
    });
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

  play(): void {
    this.plyr.player.play();
    this.isPlaying = true;
  }

  pause(): void {
    this.plyr.player.pause();
    this.isPlaying = false;
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
    this.pause();

    const currPlaylistIndex = this.playlists.indexOf(this.currActivePlaylist);
    const currSongIndex = this.currActivePlaylist.tracks.indexOf(this.nowPlaying);

    let nextSongIndex = currSongIndex + 1;

    // Loop back to the start if this is the last song
    if(nextSongIndex >= this.currActivePlaylist.tracks.length) {
      nextSongIndex = 0;
      this.loadSongViaId(currPlaylistIndex, nextSongIndex, false);
      return;
    }

    this.loadSongViaId(currPlaylistIndex, nextSongIndex, true);
  }

  /**
   * Loads the previous song in the current playlist.
   */
  loadPrevSong(): void {
    this.pause();
    
    const currPlaylistIndex = this.playlists.indexOf(this.currActivePlaylist);
    const currSongIndex = this.currActivePlaylist.tracks.indexOf(this.nowPlaying);
    let prevSongIndex = currSongIndex - 1;

    if(prevSongIndex < 0) {
      prevSongIndex = 0;
    }

    this.loadSongViaId(currPlaylistIndex, prevSongIndex, true);
  }

  /**
   * Handles the event when play button is clicked
   */
  onPlayClick(event?) {
    console.log("play clikced")
    if (event) event.stopPropagation();
    if (this.isPlaying) {
      this.playerService.onPlayerAction({
        type: PlayerActionTypes.PAUSE,
        playlist: this.currActivePlaylist,
        song: this.nowPlaying,
      });
    } else {
      this.playerService.onPlayerAction({
        type: PlayerActionTypes.PLAY,
        playlist: this.currActivePlaylist,
        song: this.nowPlaying,
      });
    }
  }

  /**
   * Handles the event when next button is clicked
   */
  onNextClick(event?) {
    if (event) event.stopPropagation();
    this.playerService.onPlayerAction({
      type: PlayerActionTypes.NEXT,
      playlist: this.currActivePlaylist,
      song: this.nowPlaying
    });
  }

  /**
   * Handles the event when prev button is clicked
   */
  onPrevClick(event?) {
    if (event) event.stopPropagation();
    this.playerService.onPlayerAction({
      type: PlayerActionTypes.PREVIOUS,
      playlist: this.currActivePlaylist,
      song: this.nowPlaying
    });
  }

  onCanPlay() {
    if(this.isCanPlay) {
      this.play();
    }
  }
}
