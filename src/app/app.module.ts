import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {environment} from '../environments/environment';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireAnalyticsModule} from '@angular/fire/analytics';
import {TodosComponent} from './todos/todos.component';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS} from '@angular/material/snack-bar';
import {HeaderComponent} from './header/header.component';
import {HomeComponent} from './pages/home/home.component';
import {AuthComponent} from './auth/auth.component';
import {SharedMaterialModule} from './shared/shared-material.module';
import {TrackerComponent} from './pages/tracker/tracker.component';
import {MapComponent} from './map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    TodosComponent,
    HeaderComponent,
    HomeComponent,
    AuthComponent,
    TrackerComponent,
    MapComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    // Shared Material Modules
    SharedMaterialModule
  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
