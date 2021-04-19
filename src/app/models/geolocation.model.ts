export interface GeolocationModel {
  coords: GeolocationCoordinates;
  timestamp: number;
  GUID: string;
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
  public coords: GeolocationCoordinates;
  public timestamp: number;
  public GUID: string;

  constructor(geolocation: any) {
    this.GUID = geolocation.GUID;
    this.coords = new GeolocationCoordinates(geolocation.coords);
    this.timestamp = geolocation.timestamp || new Date();
  }
}
