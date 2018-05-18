import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { ObjKeysPipe } from 'shared/pipes/obj-keys.pipe';
import { TitleCasePipe } from 'shared/pipes/title-case.pipe';
import { ConfigFormComponent } from './config-form.component';
import {TreeTableModule} from 'ng-treetable';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';
import { ObjectTableComponent } from './object-table/object-table.component';

@NgModule({
  imports : [
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TreeTableModule,
    NguiDatetimePickerModule
  ],
  declarations : [
    ConfigFormComponent,
    ObjKeysPipe,
    TitleCasePipe,
    ObjectTableComponent
  ],
  exports: [ConfigFormComponent]
})
export class ConfigFormModule {
}
