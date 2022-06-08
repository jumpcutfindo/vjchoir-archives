import { Component, OnInit, HostListener } from '@angular/core';
import { ListenService, Playlist, PlaylistActionType, Song } from './listen.service';
import { SovService } from '../sov/sov.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PlayerService } from 'src/app/music/player/player.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Clipboard } from '@angular/cdk/clipboard';
import { Title } from '@angular/platform-browser';
import { LoadingService } from 'src/app/loading/loading.service';

const PLAYLIST_QUERY_PARAM = 'pl';

const LISTEN_PAGE_SETTINGS_ID = 'listenSettings';
const LISTEN_TITLE = "Listen";

@Component({
  selector: 'app-listen',
  templateUrl: './listen.component.html',
  styleUrls: ['./listen.component.scss']
})
export class ListenComponent implements OnInit {
  // Handling width of window
  innerWidth = window.innerWidth;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  // Settings related
  areToastsEnabled: boolean;
  isHeaderClosedOnStart: boolean;

  // Header content related
  headerContent;
  currActiveHeader;
  isHeaderVisible = true;

  // Playlist related
  sovInfo;
  myPlaylistsInfo: Playlist[];
  importPlaylistCode = '';

  constructor(private listenService: ListenService, 
    private sovService: SovService, 
    private playerService: PlayerService, 
    private modalService: NgbModal, 
    private router: Router, 
    private route: ActivatedRoute,
    private toaster: ToastrService,
    private clipboard: Clipboard,
    private titleService: Title,
    private loadingService: LoadingService) { 
    
  }

  ngOnInit() {
    // Retrieve local settings
    const settings = localStorage.getItem(LISTEN_PAGE_SETTINGS_ID);
    if(settings == null || settings == undefined || settings == '') {
      console.log("No settings! Loading default..")
      this.areToastsEnabled = true;
      this.isHeaderClosedOnStart = false;
    } else {
      const settingsJSON = JSON.parse(settings);
      this.areToastsEnabled = settingsJSON.areToastsEnabled;
      this.isHeaderClosedOnStart = settingsJSON.isHeaderClosedOnStart;
    }

    this.isHeaderVisible = !this.isHeaderClosedOnStart;

    // Retrieve header content
    this.listenService.getHeader().subscribe(content => {
      this.headerContent = content
      this.currActiveHeader = this.headerContent.sections[0];
    });

    // Retrieve SOV info
    this.sovService.getSovInfo().subscribe(content => {
      this.sovInfo = content;
    })
    
    // Retrieve personal playlists
    this.listenService.getPlaylists().subscribe(myPlaylists => {
      this.myPlaylistsInfo = myPlaylists;
    });

    // Handles links with importing of playlist included
    this.route.queryParams.subscribe(params => {
      if(params[PLAYLIST_QUERY_PARAM]) {
        this.importPlaylist(params[PLAYLIST_QUERY_PARAM]);
      }

      this.router.navigate(['listen'], { replaceUrl: true });
    });

    this.titleService.setTitle(LISTEN_TITLE);
    this.loadingService.setLoading(false);
  }

  /**
   * Handles the updating of the playlist name / description.
   */
  onUpdatePlaylistHeaders(playlist: Playlist, element: any) {
    const property = element.getAttribute("id");

    playlist[property] = element.value;

    this.listenService.onPlaylistUpdate({
      type: PlaylistActionType.UPDATE_PLAYLIST_HEADERS,
      playlists: this.myPlaylistsInfo
    });

    this.createToast("success", "Updated '" + property + "' to '" + element.value + "'!");
  }

  /**
   * Handles creation of a new, empty playlist
   */
  createNewPlaylist(): void {
    const tempPlaylist = this.listenService.createNewPlaylist();

    this.myPlaylistsInfo.push(tempPlaylist);

    console.log("Created new playlist!");

    this.listenService.onPlaylistUpdate({
      type: PlaylistActionType.CREATE_PLAYLIST,
      playlists: this.myPlaylistsInfo
    });

    this.createToast("success", "Created a new playlist!");
  }

  /**
   * Handles deletion of a selected playlist
   */
  deletePlaylist(playlist: Playlist) {
    const playlistIndex = this.myPlaylistsInfo.indexOf(playlist);
    this.myPlaylistsInfo.splice(playlistIndex, 1);

    console.log("Deleted playlist: " + playlist.name);

    this.listenService.onPlaylistUpdate({
      type: PlaylistActionType.DELETE_PLAYLIST,
      playlists: this.myPlaylistsInfo
    });

    this.createToast("error", "Deleted playlist '" + playlist.name + "'!");
  }

  /**
   * Handles the adding of a song to a playlist 
   */
  addSongToPlaylist(song: Song, playlist: Playlist) {
    playlist.tracks.push(song);
    playlist.duration += song.duration;

    this.listenService.onPlaylistUpdate({
      type: PlaylistActionType.ADD_SONG,
      playlists: this.myPlaylistsInfo
    });

    this.createToast("success", "Added '" + song.title + "' to '" + playlist.name + "'!");
  }

  /**
   * Handles the removal of a song from a playlist
   */
  removeSongFromPlaylist(song: Song, playlist: Playlist) {
    playlist.tracks = playlist.tracks.filter(x => x != song);
    playlist.duration -= song.duration;

    this.listenService.onPlaylistUpdate({
      type: PlaylistActionType.DELETE_SONG,
      playlists: this.myPlaylistsInfo
    });
    
    this.createToast("error", "Removed '" + song.title + "' from '" + playlist.name + "'!");
  }

  playSong(playlist: Playlist, song: Song) {
    this.playerService.onSongRequest(playlist, song);
  }

  resetStorage() {
    this.myPlaylistsInfo = [];
    this.listenService.resetStorage();

    this.createToast("success", "Storage has been reset successfully!");
  }

  importPlaylist(code: string) {
    const playlist = this.listenService.parametersToPlaylist(code);
    this.myPlaylistsInfo.push(playlist);

    if(playlist.name == "Default playlist name") {
      this.createToast("error", "Unable to import the playlist using the link given! Created a default one instead.");
    } else {
      this.createToast("success", "Imported a new playlist from the link provided!");
    }
  }

  getPlaylistLink(playlist: Playlist) {
    this.createToast("success", "Playlist link has been copied to your clipboard!");
    this.clipboard.copy(this.listenService.playlistToParameters(playlist));
  }

  drop(playlist: Playlist, event: CdkDragDrop<string[]>) {
    moveItemInArray(playlist.tracks, event.previousIndex, event.currentIndex);
  }

  openModal(modal) {
    this.modalService.open(modal);
  }
  
  createToast(type: string, message: string)  {
    if(!this.areToastsEnabled) {
      return;
    }

    switch (type) {
    case "success":
      this.toaster.success(message);
      break;
    case "error":
      this.toaster.error(message);
      break;
    }
  }

  saveSettings() {
    const settingsJSON = {
      areToastsEnabled: this.areToastsEnabled,
      isHeaderClosedOnStart: this.isHeaderClosedOnStart
    };

    localStorage.setItem(LISTEN_PAGE_SETTINGS_ID, JSON.stringify(settingsJSON));
    console.log("Settings have been saved.");
  }
}
