import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { ProposalsListComponent } from './components/proposals-list/proposals-list.component';
import { ProposalDetailComponent } from './components/proposal-detail/proposal-detail.component';

import { ListProposalsPageComponent } from './containers/list-proposals-page/list-proposals-page.component';
import { ViewProposalPageComponent } from './containers/view-proposal-page/view-proposal-page.component';
//import {ProposalsFilterComponent} from './components/proposals-filter/proposals-filter.component';

import {ProposalTableComponent} from '../proposals/proposal-table/proposal-table.component';

import { ProposalsService } from './proposals.service';
import { DatasetService } from '../datasets/dataset.service';

import { proposalsReducer } from '../state-management/reducers/proposals.reducer';
import { ProposalsEffects } from '../state-management/effects/proposals.effects';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {
  MatListModule,
  MatTableModule,
  MatTabsModule,
  MatCardModule,
  MatPaginatorModule,
  MatTooltipModule,
  MatStepperModule,
  MatFormFieldModule,
  MatOptionModule,
  MatSortModule,
  MatInputModule,
} from '@angular/material';
import {ProposalTablePureComponent} from "./proposal-table-pure/proposal-table-pure.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule,

        StoreModule.forFeature('proposals', proposalsReducer),
        EffectsModule.forFeature([ProposalsEffects]),

        MatListModule,
        MatCardModule,
        MatTabsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatTooltipModule,
        MatOptionModule,
        MatInputModule,
        FormsModule,

    ],
    declarations: [
        ListProposalsPageComponent,
        ViewProposalPageComponent,

        ProposalTableComponent,
        ProposalTablePureComponent,
        ProposalsListComponent,
        ProposalDetailComponent,
      //ProposalsFilterComponent,
    ],
    providers: [
        ProposalsService,
        DatasetService,
    ]
})
export class ProposalsModule {
};
