import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {TrackerComponent} from './pages/tracker/tracker.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'tracker',
    component: TrackerComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
