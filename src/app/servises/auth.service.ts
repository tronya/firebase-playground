import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import firebase from 'firebase';
import {MatDialog} from '@angular/material/dialog';
import {LoginDialogComponent} from '../auth/login-dialog/login-dialog.component';
import {User} from '../models/user.model';
import {COLLECTIONS} from '../variables';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Subject} from 'rxjs';
import UserCredential = firebase.auth.UserCredential;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public auth: AngularFireAuth;
  private usersCollection: AngularFirestoreCollection<User> = this.afs.collection(COLLECTIONS.USERS);
  public user: Subject<User> = new Subject<User>();

  constructor(
    private fireAuth: AngularFireAuth,
    private afs: AngularFirestore,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.auth = fireAuth;
    this.init();
  }

  public init(): void {
    this.auth.user.subscribe(userData => {
      if (!userData) {
        const dialogRef = this.dialog.open(LoginDialogComponent, {
          data: {} // nothing to transfer
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.login();
          }
          dialogRef.close();
        });
      } else {
        this.checkUserInUserCollection(userData as User);
      }
    });
  }

  public checkUserInUserCollection(userInfo: User): void {
    const {uid} = userInfo;
    if (!uid) {
      throw new Error('UID is not provided');
    }

    this.usersCollection
      .doc(uid)
      .get()
      .subscribe((userRef: any) => {
        if (!userRef.exists) {
          this.saveNewUser(userInfo as User);
        }
        // saving user to service
        this.user.next(new User(userInfo));
      });
  }

  public login(): Promise<any> {
    return this.auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    ).then((resp: UserCredential) => {
      this.checkUserInUserCollection(resp.user as User);
      return resp;
    })
      .catch(error => console.error(error));
  }

  public saveNewUser(user: User): void {
    const userInstance = new User(user);

    this.usersCollection
      .doc(userInstance.uid)
      .set(JSON.parse(JSON.stringify(userInstance)))
      .then(() => this.snackBar.open(`User ${userInstance.displayName} successfully saved`))
      .catch(e => console.log(e));
  }

  public logout(): void {
    this.auth.signOut();
  }
}
