import { Component, OnInit } from '@angular/core';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Inbox', url: '/folder/Inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  
  private readonly config: BackgroundGeolocationConfig = {
    // PROVIDER
    // Ha nem az értékét írom be a ANDROID_DISTANCE_FILTER_PROVIDER-nek, akkor nem működik az app
    locationProvider: 1,
    
    // ACCURACY
    desiredAccuracy: 10,
    stationaryRadius: 20,
    distanceFilter: 30,
    
    // INTERVAL
    interval: 4900,
    fastestInterval: 4900,
    
    // FG - BG
    startForeground: true,
    stopOnStillActivity: false,
    // Enable this to clear background location settings when the app terminates
    stopOnTerminate: false,
    
    // DEBUG
    // Enable this hear sounds for background-geolocation life-cycle
    debug: true,

    // STORING, SYNCING
    syncThreshold: 5,

    // SERVER
    url: "https://ptsv2.com/t/npgo7-1612270288/post",
    httpHeaders: {
      'Access-Control-Allow-Origin': '*'
    },
    // Customize post properties
    postTemplate: {
      latitude: '@latitude',
      longitude: '@longitude',
      timeInMs: '@time'
    }
  }

  constructor(
    private readonly platform: Platform) {}

  ngOnInit() {
    this.platform.ready()
      .then(_ => this.initApp())
  }

  initApp() {
    BackgroundGeolocation.configure(this.config)
      .then(() => {
        BackgroundGeolocation.on(BackgroundGeolocationEvents.background)
          .subscribe(() => {
            console.log("[INFO] Background mode");
            // console.log('[INFO] Background mode is ', this.backgroundMode.isActive() ? '' : 'not ', 'active and ', this.backgroundMode.isEnabled() ? '' : 'not ', 'enabled.');
          });
      });

    BackgroundGeolocation.on(BackgroundGeolocationEvents.location)
      .subscribe(
        (location: BackgroundGeolocationResponse) => {
          BackgroundGeolocation.startTask().then(taskKey => {
            console.log(`[INFO] Location updated, new location: ${new Date(location.time)}, ${new Date()}, ${location.longitude}, ${location.latitude}`);
            BackgroundGeolocation.endTask(taskKey);
          })
        }
      );

    BackgroundGeolocation.on(BackgroundGeolocationEvents.stationary)
      .subscribe(
        (location: BackgroundGeolocationResponse) => {
          console.log(`[INFO] Stationary Location updated, new location: ${new Date(location.time)}, ${new Date()}, ${location.longitude}, ${location.latitude}`);
        }
      );
  }
}
