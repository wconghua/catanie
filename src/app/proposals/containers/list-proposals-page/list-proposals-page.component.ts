import {Component, OnInit, OnDestroy, Input, ViewChild} from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { map } from 'rxjs/operators/map';

import { AppState } from 'state-management/state/app.store';
import { ProposalsState } from 'state-management/state/proposals.store';

import { Proposal } from 'state-management/models';
import { getProposalList, getHasFetched, getFilteredProposalList} from 'state-management/selectors/proposals.selectors';
import { FetchProposalsAction, UpdateProposalFilterAction } from 'state-management/actions/proposals.actions';

import { Router } from "@angular/router";
import * as selectors from "../../../state-management/selectors";
import {MatPaginator, MatTableDataSource} from "@angular/material";
import {AfterViewInit} from "@angular/core/src/metadata/lifecycle_hooks";
import * as dsa from "../../../state-management/actions/datasets.actions";
import { ProposalsService } from '../../proposals.service';

@Component({
    selector: 'list-proposals-page',
    template: `
        <proposal-table [proposals2]="proposals">
        </proposal-table>
    `
})
export class ListProposalsPageComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    private proposals: Observable<Proposal[]>;
    subscriptions = [];
    propos = [];

    constructor(
      private store: Store<AppState>,
      private router: Router,
      private proposalService: ProposalsService

    )
    {

    }

    ngOnInit() {
      this.proposals = this.proposalService.getProposals();
    }

    ngOnDestroy() {
       // this.subscription.unsubscribe();
    }

};
