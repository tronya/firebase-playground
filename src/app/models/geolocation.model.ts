export interface GeolocationModel {
  coords: GeolocationCoordinates;
  timestamp: number;
  uid: string;
  displayName: string;
  photoURL: string;
}

export interface GeolocationCoordinates {
  accuracy: number;
  altitude: number;
  altitudeAccuracy: number;
  heading: number;
  latitude: number;
  longitude: number;
  speed: number;
}

export class GeolocationCoordinates implements GeolocationCoordinates {
  public accuracy: number;
  public altitude: number;
  public altitudeAccuracy: number;
  public heading: number;
  public latitude: number;
  public longitude: number;
  public speed: number;

  constructor(geo: any) {
    this.accuracy = geo.accuracy;
    this.altitude = geo.altitude;
    this.altitudeAccuracy = geo.altitudeAccuracy;
    this.heading = geo.heading;
    this.latitude = geo.latitude;
    this.longitude = geo.longitude;
    this.speed = geo.speed;
  }
}

export class BaseGeolocation implements GeolocationModel {
  public uid: string;
  public displayName: string;
  public photoURL: string;
  public coords: GeolocationCoordinates;
  public timestamp: number;

  constructor(geolocation: any) {
    this.uid = geolocation.uid;
    this.displayName = geolocation.displayName;
    this.photoURL = geolocation.photoURL;
    this.coords = geolocation.coords && new GeolocationCoordinates(geolocation.coords);
    this.timestamp = geolocation.timestamp || new Date();
  }
}
