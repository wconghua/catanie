import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { AppState } from 'state-management/state/app.store';

import { Proposal } from 'state-management/models';
import { UpdateProposalFilterAction } from 'state-management/actions/proposals.actions';


import {MatSort} from "@angular/material";

import {getPage, getProposals, getActiveFilters, getTotalSets, getLoading, getText} from "../../../state-management/selectors/proposals.selectors";

@Component({
  selector: 'list-proposals-page',
  template: `
    <proposal-table [proposals$]="proposals$"
                    [currentPage]="currentPage$"
                    [limit]="limit$"
                    [loading]="loading$"
                    [proposalCount$]="proposalCount$"
                    [searchText$]="searchText$"
                    [matSort]="matSort">
    </proposal-table>
  `
})
export class ListProposalsPageComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private proposals$: Observable<Proposal[]>;
  subscriptions = [];
  private limit$: Observable<number>;
  private currentPage$: Observable<number>;
  private proposalCount$: Observable<number>;
  private loading$: Observable<boolean>;
  private activeFilter$: Observable<object>;
  @ViewChild(MatSort) matSort: MatSort;
  searchText$;

  constructor(
    private store: Store<AppState>

  )
  {
    this.proposalCount$ = this.store.select(getTotalSets);
    this.loading$ = this.store.select(getLoading);
  }

  ngOnInit() {
    this.activeFilter$ = this.store.select(getActiveFilters);
    this.proposals$ = this.store.pipe(select(getProposals));
    this.currentPage$ = this.store.pipe(select(getPage));
    this.limit$ = this.store.select(state => state.proposals.totalProposals);
    this.searchText$ = this.store.select(getText);

    this.subscription = this.activeFilter$.subscribe(filter => {
      this.store.dispatch(new UpdateProposalFilterAction(filter));
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
};
