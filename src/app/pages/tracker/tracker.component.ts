import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../servises/auth.service';
import {COLLECTIONS, GUID} from '../../variables';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {BaseGeolocation, GeolocationModel} from '../../models/geolocation.model';
import {BehaviorSubject, Subject} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss']
})
export class TrackerComponent implements OnInit, OnDestroy {
  public trackerCollection?: AngularFirestoreCollection<GeolocationModel>;
  public userMarkers: BehaviorSubject<GeolocationModel[]> = new BehaviorSubject<GeolocationModel[]>([]);

  public userId?: string;
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
    this.authService.auth.authState.subscribe(user => this.userId = user?.uid);
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
    navigator.geolocation.watchPosition(r => this.success(r), this.error, this.options);
  }

  public showUserMarkers(): void {
    this.trackerCollection = this.afs.collection(COLLECTIONS.TRACKER);
    this.trackerCollection.valueChanges({idField: GUID}).subscribe(tracks => this.userMarkers.next(tracks));
  }

  public success(pos: any): void {
    if (this.trackerCollection) {
      if (!this.userId) {
        return;
      }
      const position = JSON.parse(JSON.stringify(new BaseGeolocation(pos)));
      this.trackerCollection
        .doc(this.userId)
        .set(position)
        .then((resp) => {
          console.log(resp);
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
