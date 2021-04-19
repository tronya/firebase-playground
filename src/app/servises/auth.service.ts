import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public auth: AngularFireAuth;

  constructor(private fireAuth: AngularFireAuth) {
    this.auth = fireAuth;
  }

  public getState(): Observable<any> {
    return this.auth.authState;
  }

  public login(): void {
    this.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    );
  }

  public logout(): void {
    this.auth.signOut();
  }
}
