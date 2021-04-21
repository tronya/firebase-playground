import {Component, Input, OnInit} from '@angular/core';
import * as MapBox from 'mapbox-gl';
import {GeoJSONSource, LngLatLike} from 'mapbox-gl';
import {environment} from '../../environments/environment';
import {Subject} from 'rxjs';
import {BaseGeolocation, GeolocationModel} from '../models/geolocation.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @Input('markers') public markersAsync?: Subject<GeolocationModel[]>;
  @Input() public center: Subject<BaseGeolocation> = new Subject<BaseGeolocation>();
  public map?: MapBox.Map;

  constructor() {
  }

  ngOnInit(): void {
    this.map = new MapBox.Map({
      accessToken: environment.mapbox.accessToken,
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v10',
      zoom: 10,
      center: [24, 49]
    }).on('load', () => {
      this.subscribeToMarkers();
    });

    this.center.subscribe(center => {
      this.setCenter({
        lat: center.coords.latitude,
        lng: center.coords.longitude
      });
    });
  }

  public subscribeToMarkers(): void {
    if (!this.map) {
      return;
    }

    this.map.addSource('users', {type: 'geojson', data: {type: 'FeatureCollection', features: []}});
    this.map.addLayer({
      id: 'users',
      type: 'symbol',
      source: 'users',
      layout: {
        'icon-image': 'marker-15'
      }
    });


    if (this.markersAsync) {
      this.markersAsync.subscribe(userGeolocation => {
        const geojson = {
          type: 'FeatureCollection',
          features: userGeolocation.map(user => {
            return {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [user.coords.longitude, user.coords.latitude] as LngLatLike
              },
              properties: {
                iconUrl: 'http://magicemi.byethost10.com/img/vub.png',
                title: 'Mapbox',
                description: 'San Francisco, California'
              }
            };
          })
        };
        this.updateMarkers(geojson);
      });
    }
  }

  public updateMarkers(geoJson: any): void {
    if (this.map) {
      const source = this.map.getSource('users') as GeoJSONSource;
      console.log(source);
      source.setData(geoJson);
    }
  }

  public setCenter(center: { lng: number; lat: number }): void {
    if (this.map) {
      this.map.flyTo({center, speed: 1});
    }
  }

}
