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
import {FetchProposalAction} from "../../../state-management/actions/proposals.actions";
import {getPage, getProposals2} from "../../../state-management/selectors/proposals.selectors";
import {PageChangeEvent} from "../../proposal-table-pure/proposal-table-pure.component";
import * as psa from "../../../state-management/actions/proposals.actions";

@Component({
    selector: 'list-proposals-page',
    template: `
        <proposal-table [proposals$]="proposals$" [currentPage]="currentPage$" [limit]="limit$" [loading]="loading$" [proposalCount$]="proposalCount$">
        </proposal-table>
    `
})
export class ListProposalsPageComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    private proposals$: Observable<Proposal[]>;
    subscriptions = [];
    propos = [];
    private limit$: Observable<number>;
    private currentPage$: Observable<number>;
    private proposalCount$: Observable<number>;
    private loading$: Observable<boolean>;

    constructor(
      private store: Store<AppState>,
      private router: Router,
      private proposalService: ProposalsService

    )
    {
      this.proposalCount$ = this.store.select(selectors.proposals.getTotalSets);
      this.loading$ = this.store.select(selectors.proposals.getLoading);
    }

    ngOnInit() {
      this.store.dispatch(new FetchProposalsAction());
      this.store.dispatch(new UpdateProposalFilterAction(this.store.select(selectors.proposals.getActiveFilters)));
      //this.proposals$ = this.store.pipe(select(getProposals2));
      this.currentPage$ = this.store.pipe(select(getPage));
      this.limit$ = this.store.select(state => state.proposals.totalProposals);

    }

    ngOnDestroy() {
       // this.subscription.unsubscribe();
    }

};
