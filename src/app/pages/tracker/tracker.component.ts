import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../servises/auth.service';
import {GUID} from '../../variables';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {BaseGeolocation, GeolocationModel} from '../../models/geolocation.model';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss']
})
export class TrackerComponent implements OnInit, OnDestroy {
  public trackerCollection?: AngularFirestoreCollection<GeolocationModel>;
  tacks?: Observable<GeolocationModel[]>;
  public userId?: string;

  public watcherId?: number;
  public options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0
  };

  constructor(
    private authService: AuthService,
    private afs: AngularFirestore,
  ) {
    this.authService.auth.authState.subscribe(user => this.userId = user?.uid);
  }

  public ngOnDestroy(): void {
    if (this.watcherId) {
      navigator.geolocation.clearWatch(this.watcherId);
    }
  }

  public ngOnInit(): void {
    this.trackerCollection = this.afs.collection('tracker');
    this.tacks = this.trackerCollection.valueChanges({idField: GUID});
    navigator.geolocation.getCurrentPosition(r => this.success(r), this.error, this.options);
  }

  public success(pos: any): void {
    if (this.trackerCollection) {
      if (!this.userId) {
        return;
      }
      const position = JSON.parse(JSON.stringify(new BaseGeolocation(pos)));
      this.trackerCollection.add({...position, UID: this.userId}).then((resp) => {
        console.log(resp);
      });
    }
  }

  public error(err: any): void {
    console.warn('ERROR(' + err.code + '): ' + err.message);
  }
}
