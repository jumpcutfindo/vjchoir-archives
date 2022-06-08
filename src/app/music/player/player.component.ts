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
  isPlaying: boolean = false;

  isCanPlay: boolean = false;
  isBuffering: boolean = true;

  activeWindowTitle: string;
  currDisplayedPlaylist: Playlist;
  currDisplayedPlaylistId: number;
  currActivePlaylist: Playlist;
  
  nowPlaying: Song;

  playerPlaylistsWindow: HTMLElement;

  audioSources: Plyr.Source[] = [];

  constructor(private navController: NavControllerService, private sovService: SovService, private listenService: ListenService, private playerService: PlayerService) {
    // Whenever there are any updates to the playlists, load the playlists
    this.listenService.playlistUpdates.subscribe(action => {
      this.loadCustomPlaylists();
    });

    this.playerService.songRequestUpdates.subscribe(val => {
      this.loadSong(val.playlist, val.song, true);
    })

    this.navController.clickedSong.subscribe(val => {
      const song: Song = val;
      this.loadSongViaId(val.playlistId, val.id, true);
    });
  }

  ngOnInit() {
    this.activeWindowTitle = PLAYLISTS_DEFAULT_TITLE;
    this.isMinimised = true;
    this.playerPlaylistsWindow = document.getElementById("player-playlists");

    this.loadSongViaId(0, 0, false);
  }

  loadDefaultPlaylists(): void {
    this.sovService.getSovInfo().subscribe((info) => {
      this.sovInfo = info;
    })
  }

  loadCustomPlaylists(): void {
    this.listenService.getPlaylists().subscribe(playlists => {
      this.myPlaylists = playlists;
    });
  }

  displayPlaylist(playlist: Playlist) {
    this.currDisplayedPlaylist = playlist;
    this.currDisplayedPlaylistId = this.playlists.indexOf(playlist);
    this.activeWindowTitle = playlist.name;
    this.playerPlaylistsWindow.scroll(0, 0);
  }

  getDefaultPlaylists(): Playlist[] {
    let defaultPlaylists = this.playlists.filter(x => x.isDefault);
    return defaultPlaylists;
  }

  getMyPlaylists(): Playlist[] {
    let myPlaylists = this.playlists.filter(x => !x.isDefault);
    return this.playlists.filter(x => !x.isDefault);
  }

  onBackClick() {
    this.currDisplayedPlaylist = null;
    this.activeWindowTitle = PLAYLISTS_DEFAULT_TITLE;
    this.playerPlaylistsWindow.scroll(0, 0);
  }

  loadSongViaId(playlistId: number, songId: number, isPlayOnLoad: boolean) {
    console.log("Loading '" + this.playlists[playlistId].tracks[songId].title + "' of playlist '" + this.playlists[playlistId].name + "'");
    const selected: Song = this.playlists[playlistId].tracks[songId];
    this.audioSources = [
      {
        src: selected.src,
        type: "audio/mp3"
      }
    ]
    this.nowPlaying = selected;
    this.currActivePlaylist = this.playlists[playlistId];
    this.isCanPlay = isPlayOnLoad;
  }

  loadSong(playlist: Playlist, song: Song, isPlayOnLoad: boolean = true) {
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
  }

  loadNextSong() {
    let currPlaylistIndex = this.playlists.indexOf(this.currActivePlaylist);
    let currSongIndex = this.currActivePlaylist.tracks.indexOf(this.nowPlaying);
    let nextSongIndex = currSongIndex + 1;

    if(nextSongIndex >= this.currActivePlaylist.tracks.length) {
      nextSongIndex = 0;
    }

    this.loadSongViaId(currPlaylistIndex, nextSongIndex, true);
  }

  loadPrevSong() {
    let currPlaylistIndex = this.playlists.indexOf(this.currActivePlaylist);
    let currSongIndex = this.currActivePlaylist.tracks.indexOf(this.nowPlaying);
    let prevSongIndex = currSongIndex + 1;

    if(prevSongIndex < this.currActivePlaylist.tracks.length) {
      prevSongIndex = 0;
    }

    this.loadSongViaId(currPlaylistIndex, prevSongIndex, true);
  }

  onBigPlayClick(event) {
    event.stopPropagation();
    if(this.isPlaying) {
      this.plyr.player.pause();
    } else {
      this.plyr.player.play();
    }
  }

  onBigNextClick(event) {
    event.stopPropagation();
    this.loadNextSong();
  }

  onBigPrevClick(event) {
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
