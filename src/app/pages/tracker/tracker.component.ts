import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../servises/auth.service';
import {COLLECTIONS, GUID} from '../../variables';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {BaseGeolocation, GeolocationModel} from '../../models/geolocation.model';
import {BehaviorSubject, Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {User} from '../../models/user.model';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss']
})
export class TrackerComponent implements OnInit, OnDestroy {
  public trackerCollection?: AngularFirestoreCollection<GeolocationModel>;
  public userMarkers: BehaviorSubject<GeolocationModel[]> = new BehaviorSubject<GeolocationModel[]>([]);

  public user?: User;
  public center: Subject<BaseGeolocation> = new Subject<BaseGeolocation>();

  public watcherId?: number;
  public options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0
  };

  constructor(
    private authService: AuthService,
    private afs: AngularFirestore,
    private snackBar: MatSnackBar
  ) {
    this.authService.user.subscribe(user => this.user = user);
  }

  public ngOnDestroy(): void {
    if (this.watcherId) {
      navigator.geolocation.clearWatch(this.watcherId);
    }
  }

  public getRandomInRange(from: any, to: number, fixed: number): number {
    return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
  }

  public ngOnInit(): void {
    this.showUserMarkers();
    navigator.geolocation.watchPosition(r => this.success(r), e => this.error(e), this.options);
  }

  public showUserMarkers(): void {
    this.trackerCollection = this.afs.collection(COLLECTIONS.TRACKER);
    this.trackerCollection.valueChanges({idField: GUID}).subscribe(tracks => this.userMarkers.next(tracks));
  }

  public success(pos: any): void {
    if (this.trackerCollection) {
      if (!this.user?.uid) {
        return;
      }
      const geoUserObject = new BaseGeolocation({
        coords: pos.coords,
        timestamp: pos.timestamp,
        uid: this.user.uid,
        photoURL: this.user.photoURL,
        displayName: this.user.displayName
      });

      const position = JSON.parse(JSON.stringify(geoUserObject));
      this.trackerCollection
        .doc(this.user.uid)
        .set(position)
        .then((resp) => {
          this.center.next(pos);
        });
    }
  }

  public error(err: any): void {
    const errorMessage = `ERROR(${err.code}):  ${err.message}`;
    this.snackBar.open(errorMessage, undefined, {
      duration: 3000
    });
    console.warn(errorMessage);
  }
}
