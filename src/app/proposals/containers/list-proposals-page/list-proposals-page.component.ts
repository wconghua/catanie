import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { map } from 'rxjs/operators/map';

import { AppState } from 'state-management/state/app.store';
import { ProposalsState } from 'state-management/state/proposals.store';

import { Proposal } from 'state-management/models';
import { getProposalList, getHasFetched } from 'state-management/selectors/proposals.selectors';
import { FetchProposalsAction } from 'state-management/actions/proposals.actions';

import { Router } from "@angular/router";

@Component({
    selector: 'list-proposals-page',
    template: `
        <proposals-list [proposals]="proposals$ | async">
        </proposals-list>
    `
})
export class ListProposalsPageComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    private proposals$: Observable<Proposal[]>;
    private hasFetched$: Observable<boolean>;


  constructor(private store: Store<AppState>, private router: Router,) {}


    ngOnInit() {
        this.proposals$ = this.store.pipe(select(getProposalList));

        this.hasFetched$ = this.store.pipe(select(getHasFetched));

        this.subscription = this.hasFetched$.pipe(
            distinctUntilChanged(),
            map(() => new FetchProposalsAction())
        )
        .subscribe(this.store);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

};
