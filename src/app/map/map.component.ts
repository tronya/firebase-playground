import {Component, Input, OnInit} from '@angular/core';
import * as MapBox from 'mapbox-gl';
import {LngLatLike, Map} from 'mapbox-gl';
import {environment} from '../../environments/environment';
import {Subject} from 'rxjs';
import {BaseGeolocation, GeolocationModel} from '../models/geolocation.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  public map?: mapboxgl.Map;
  public userLocation = new MapBox.Marker();

  @Input('markers') public markersAsync?: Subject<GeolocationModel[]>;
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
    this.checkMarkers();

    this.center.subscribe(center => {
      this.setCenter({
        lat: center.coords.latitude,
        lng: center.coords.longitude
      });
    });
  }

  public checkMarkers(): void {
    if (!this.map) {
      return;
    }

    if (this.markersAsync) {
      this.markersAsync.subscribe(userGeolocation => {
        const features = userGeolocation.map(user => {
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [user.coords.longitude, user.coords.latitude] as LngLatLike
            },
            properties: {
              title: 'Mapbox',
              description: 'San Francisco, California'
            }
          };
        });
        features.forEach(feature => {
          // create a HTML element for each feature
          const el = document.createElement('div');
          el.className = 'marker';

          // make a marker for each feature and add to the map
          if (this.map instanceof Map) {
            new MapBox.Marker(el)
              .setLngLat(feature.geometry.coordinates)
              .addTo(this.map);
          }

        });
      });
    }
  }

  public setCenter(center: { lng: number; lat: number }): void {
    if (this.map) {
      this.map.panTo(center, {
        duration: 3000
      });
    }
  }

}
