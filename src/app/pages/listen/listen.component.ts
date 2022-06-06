import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, HostListener } from '@angular/core';
import { ListenService } from './listen.service';
import { SovService } from '../sov/sov.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Playlist } from 'src/app/music/model/Playlist';
import { Song } from 'src/app/music/model/Song';
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

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
  }

  // Settings related
  areToastsEnabled: boolean;
  isHeaderClosedOnStart: boolean;

  innerWidth = window.innerWidth;

  headerContent;
  sovInfo;
  myPlaylistsInfo: Playlist[];
  currActiveHeader;
  isHeaderVisible: boolean = true;

  importPlaylistCode: string = '';

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
    let settings = localStorage.getItem(LISTEN_PAGE_SETTINGS_ID);
    if(settings == null || settings == undefined || settings == '') {
      console.log("No settings! Loading default..")
      this.areToastsEnabled = true;
      this.isHeaderClosedOnStart = false;
    } else {
      let settingsJSON = JSON.parse(settings);
      console.log(settingsJSON);
      this.areToastsEnabled = settingsJSON.areToastsEnabled;
      this.isHeaderClosedOnStart = settingsJSON.isHeaderClosedOnStart;
    }

    this.isHeaderVisible = !this.isHeaderClosedOnStart;


    this.listenService.getHeader().subscribe(content => {
      this.headerContent = content
      this.currActiveHeader = this.headerContent.sections[0];
    });

    this.sovService.getSovInfo().subscribe(content => {
      this.sovInfo = content;
    })

    this.sovInfo.map(item => {
      item.isOpen = false;
      return item;
    });

    this.listenService.getPlaylists().subscribe(myPlaylists => {
      this.myPlaylistsInfo = this.listenService.myPlaylists;
    });

    this.route.queryParams.subscribe(params => {
      if(params[PLAYLIST_QUERY_PARAM]) {
        this.importPlaylist(params[PLAYLIST_QUERY_PARAM]);
      }

      this.router.navigate(['listen'], { replaceUrl: true });
    });

    this.titleService.setTitle(LISTEN_TITLE);
    this.loadingService.setLoading(false);
  }

  onKeyEnter(playlist: Playlist, element: any) {
    let property = element.getAttribute("id");

    playlist[property] = element.value;
    this.listenService.savePlaylists(this.myPlaylistsInfo);

    console.log("Updated '" + property + "' to '" + element.value + "'!");
  }

  createNewPlaylist() {
    let tempPlaylist = this.listenService.createNewPlaylist();

    this.myPlaylistsInfo.push(tempPlaylist);
    this.listenService.savePlaylists(this.myPlaylistsInfo);

    console.log("Created new playlist!");

    this.playerService.onPlaylistUpdate({
      type: "Create playlist",
      playlist: tempPlaylist
    });
    this.createToast({
      type: "success",
      msg: "Created a new playlist!"
    });
  }

  deletePlaylist(playlist: Playlist) {
    const playlistIndex = this.myPlaylistsInfo.indexOf(playlist);
    this.myPlaylistsInfo.splice(playlistIndex, 1);
    this.listenService.savePlaylists(this.myPlaylistsInfo);

    console.log("Deleted playlist: " + playlist.name);

    this.playerService.onPlaylistUpdate({
      type: "Delete playlist",
      playlist: playlist
    });
    this.createToast({
      type: "error",
      msg: "Deleted playlist '" + playlist.name + "'!"
    });
  }

  addSongToPlaylist(song: Song, playlist: Playlist) {
    playlist.tracks.push(song);
    playlist.duration.add(song.duration);

    this.listenService.savePlaylists(this.myPlaylistsInfo);

    this.playerService.onPlaylistUpdate({
      type: "Add song",
      playlist: playlist
    });

    this.createToast({
      type: "success",
      msg: "Added '" + song.title + "' to '" + playlist.name + "'!"
    });
  }

  removeSongFromPlaylist(song: Song, playlist: Playlist) {
    playlist.tracks = playlist.tracks.filter(x => x != song);
    playlist.duration.subtract(song.duration);

    this.listenService.savePlaylists(this.myPlaylistsInfo);

    this.playerService.onPlaylistUpdate({
      type: "Remove song",
      playlist: playlist
    });
    
    this.createToast({
      type: "error",
      msg: "Removed '" + song.title + "' from '" + playlist.name + "'!"
    });
  }

  playSong(playlist: Playlist, song: Song) {
    this.playerService.onSongRequest(playlist, song);
  }

  resetStorage() {
    this.myPlaylistsInfo = [];
    this.listenService.resetStorage();

    this.createToast({
      type: "error",
      msg: "Storage has been reset!"
    });
  }

  importPlaylist(code: string) {
    console.log(code);

    let playlist = this.listenService.parametersToPlaylist(code);
    this.myPlaylistsInfo.push(playlist);
    this.listenService.savePlaylists(this.myPlaylistsInfo);

    if(playlist.name == "Default playlist name") {
      this.createToast({
        type: "error",
        msg: "Unable to import the playlist using the link given! Created a default one instead."
      });
    } else {
      this.createToast({
        type: "success",
        msg: "Imported a new playlist from the link provided!"
      });
    }

    
  }

  exportPlaylist(playlist: Playlist): string {
    let string = this.listenService.playlistToParameters(playlist);
    
    return string;
  }

  getPlaylistLink(playlist: Playlist) {
    this.createToast({
      type: "success",
      msg: "Playlist link has been copied to your clipboard!"
    });
    this.clipboard.copy(this.exportPlaylist(playlist));
  }

  drop(playlist: Playlist, event: CdkDragDrop<string[]>) {
    moveItemInArray(playlist.tracks, event.previousIndex, event.currentIndex);
    this.listenService.savePlaylists(this.myPlaylistsInfo);
  }

  openModal(modal) {
    this.modalService.open(modal);
  }
  
  createToast(params) {
    if(!this.areToastsEnabled) {
      return;
    }

    if(params.type == "success") {
      this.toaster.success(params.msg);
    } else if(params.type == "error") {
      this.toaster.error(params.msg);
    }
  }

  saveSettings() {
    let settingsJSON = {
      areToastsEnabled: this.areToastsEnabled,
      isHeaderClosedOnStart: this.isHeaderClosedOnStart
    }

    console.log(settingsJSON);
    localStorage.setItem(LISTEN_PAGE_SETTINGS_ID, JSON.stringify(settingsJSON));
    console.log("Settings have been saved.");
  }
}
