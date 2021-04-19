import {NgModule} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDividerModule} from '@angular/material/divider';

@NgModule({
  imports: [
    MatTableModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatDividerModule],
  exports: [
    MatTableModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatDividerModule],
  providers: []
})

export class SharedMaterialModule {
}
