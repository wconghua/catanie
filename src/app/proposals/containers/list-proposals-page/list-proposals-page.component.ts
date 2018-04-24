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
import { FetchProposalsAction } from 'state-management/actions/proposals.actions';

import { Router } from "@angular/router";
import * as selectors from "../../../state-management/selectors";
import {MatPaginator, MatTableDataSource} from "@angular/material";
import {AfterViewInit} from "@angular/core/src/metadata/lifecycle_hooks";
import * as dsa from "../../../state-management/actions/datasets.actions";
import { ProposalsService } from '../../proposals.service';

@Component({
    selector: 'list-proposals-page',
    template: `
        <proposals-list [proposals]="proposals$ | async" [dataSource]="dataSource" [proposalsCount]="proposalsCount$" [limit]="limit">
        </proposals-list>
    `
})
export class ListProposalsPageComponent implements OnInit, OnDestroy, AfterViewInit {
    private subscription: Subscription;
    private proposals$: Observable<Proposal[]>;
    private hasFetched$: Observable<boolean>;
    limit: any = 10;

    propos = [];
    proposalsCount$;
    dataSource: MatTableDataSource <Proposal> | null;
    @ViewChild(MatPaginator) paginator: MatPaginator;


    constructor(
      private store: Store<AppState>,
      private router: Router,
      private proposalService: ProposalsService
    ){}

    ngOnInit() {
        //this.proposals$ = this.store.pipe(select(getProposalList));

      this.limit = this.proposalService.limit;
      //this.limit2$ = this.store.select(state => state.proposals.proposalCount);
      const filters = Object.assign({});
      filters['limit'] = this.limit;

      this.proposalsCount$ = this.store.select(selectors.proposals.getTotalProposals);
      this.proposals$ = this.proposalService.getFilteredProposals(filters);
      //this.proposalsCount$ = this.store.select(selectors.proposals.getTotalProposals);
      //let count = this.store.select(selectors.proposals.getTotalProposals);
      /*this.proposals$.subscribe(
        data => {
          if (!data) return;
          this.propos = data;
          this.dataSource = new MatTableDataSource(this.propos);
          setTimeout(() => this.dataSource.paginator = this.paginator);
        },
        error => {
          console.error(error);
        }
      );*/

        this.store.select(selectors.proposals.getProposalList).subscribe(
          data => {
            this.propos = data;
            this.dataSource = new MatTableDataSource(this.propos);
            //this.dataSource.sort = this.sort;
          },
          error => {
            console.error(error);
          }
        );
      /*this.proposalService.getFilteredProposals(this.limit).subscribe(
        data => {
          if (!data) return;
          this.propos = data;
          this.dataSource = new MatTableDataSource(this.propos);
        },
        error => {
          console.error(error);
        }
      );*/


      this.proposalService.getProposals().subscribe(
        data => {
          if (!data) return;
          if (data.length > 0){
            this.proposalsCount$ = data.length;
          }
        },
        error => {
          console.error(error);
        }
      );
        //this.dataSource = new MatTableDataSource(this.proposalService.getFilteredProposals(this.limit$));
        /*this.store.pipe(select(getFilteredProposalList)).subscribe(
          data => {
            this.propos = data;
            this.dataSource = new MatTableDataSource(this.propos);
            //this.dataSource.sort = this.sort;
          },
          error => {
            console.error(error);
          }
        );*/

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

  ngAfterViewInit() {
      if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      //this.dataSource.sort = this.sort;
    }
  }

  /**
   * Retrieves all datasets each time a new page
   * is selected in the table
   * @param event
   */
  onPage(event) {
    const index = this.paginator.pageIndex;
    const size = this.paginator.pageSize;
    this.store
      .subscribe(f => {
        const filters = Object.assign({}, f);
        filters['skip'] = index * size;
        filters['initial'] = false;
        filters['limit'] = size;
        if (event && event.active && event.direction) {
          filters['sortField'] = event.active + ' ' + event.direction;
        } else {
          filters['sortField'] = undefined;
        }
        // TODO reduce calls when not needed (i.e. no change)
        // if (f.first !== event.first || this.datasets.length === 0) {
        //this.store.dispatch(new dsa.UpdateProposalFilterAction(filters));
        // }
      });
  }

};
