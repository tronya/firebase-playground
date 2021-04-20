import {Component, Input, OnInit} from '@angular/core';
import * as MapBox from 'mapbox-gl';
import {environment} from '../../environments/environment';
import {Subject} from 'rxjs';
import {BaseGeolocation} from '../models/geolocation.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  public map?: mapboxgl.Map;
  public userLocation = new MapBox.Marker();
  @Input('center') public center: Subject<BaseGeolocation> = new Subject<BaseGeolocation>();

  constructor() {
  }

  ngOnInit(): void {
    // @ts-ignore
    MapBox.accessToken = environment.mapbox.accessToken;
    this.map = new MapBox.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: 13,
      center: [24, 49]
    });
    this.center.subscribe(center => {
      this.setCenter({
        lat: center.coords.latitude,
        lng: center.coords.longitude
      });
    });
  }

  public setCenter(center: { lng: number; lat: number }): void {
    if (this.map) {
      this.map.panTo(center, {
        duration: 3000
      });

      this.userLocation
        .setLngLat(center)
        .addTo(this.map);
    }
  }

}
