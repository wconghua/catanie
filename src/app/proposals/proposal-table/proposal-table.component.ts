import { DatePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  OnDestroy,
} from '@angular/core';

import { Router, ActivatedRoute, Data } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { Subject } from 'rxjs/Subject';

import { Proposal } from 'shared/sdk/models';
import { ConfigService } from 'shared/services/config.service';
import { DialogComponent } from 'shared/modules/dialog/dialog.component';
import * as utils from 'shared/utils';
import { config } from '../../../config/config';

import * as psa from 'state-management/actions/proposals.actions';
import * as selectors from 'state-management/selectors';
import * as ua from 'state-management/actions/user.actions';
import * as ja from 'state-management/actions/jobs.actions';
import { getProposals2, getPage } from 'state-management/selectors/proposals.selectors';
import { Message, MessageType } from 'state-management/models';

import { Angular5Csv } from 'angular5-csv/Angular5-csv';

import { last } from 'rxjs/operator/last';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { startWith } from 'rxjs/operator/startWith';
import { take } from 'rxjs/operator/take';

import { PageChangeEvent, SortChangeEvent } from '../proposal-table-pure/proposal-table-pure.component';

import * as rison from 'rison';
import { Subscription } from 'rxjs';
import {
  FetchProposalsAction,
  TotalProposalsAction,
  UpdateProposalFilterAction
} from "../../state-management/actions/proposals.actions";
import * as pStore from "../../state-management/state/proposals.store";

@Component({
  selector: 'proposal-table',
  templateUrl: './proposal-table.component.html',
  styleUrls: ['./proposal-table.component.scss']
})
export class ProposalTableComponent implements OnInit, OnDestroy {
  @Input() private proposals = [];
  @Output() private openProposal = new EventEmitter();

  private proposals$: Observable<Proposal[]>;
  private currentPage$: Observable<number>;
  private proposalCount$: Observable<number>;

  // compatibility analogs of observables
  private loading$: Observable<boolean>;
  private limit$: Observable<number>;
  propos = [];

  constructor(
    private router: Router,
    private configSrv: ConfigService,
    private route: ActivatedRoute,
    private store: Store<any>,
    public dialog: MatDialog,
  ) {
    this.proposalCount$ = this.store.select(selectors.proposals.getTotalSets);
    this.loading$ = this.store.select(selectors.proposals.getLoading);
  }

  ngOnInit() {
    this.store.dispatch(new FetchProposalsAction());
    this.store.dispatch(new UpdateProposalFilterAction(this.store.select(selectors.proposals.getActiveFilters)));
    /*this.store
      .select(selectors.proposals.getActiveFilters)
      .subscribe(filters => {
        // if (filters.skip !== this.dsTable.first) {
        new UpdateProposalFilterAction(filters)
        // }
      })*/
    this.proposals$ = this.store.pipe(select(getProposals2));
    this.currentPage$ = this.store.pipe(select(getPage));
    this.limit$ = this.store.select(state => state.proposals.totalProposals);

  }

  ngOnDestroy() {}

  setCurrentPage(n: number) {
  }

  onClick(proposal: Proposal): void {
    const proposalId = encodeURIComponent(proposal.proposalId);
    this.router.navigateByUrl('/proposal/' + proposalId);
  }

  onPageChange(event: PageChangeEvent): void {
    this.store.dispatch(new psa.GoToPageAction(event.pageIndex));
  }

  onSortChange(event: SortChangeEvent): void {
    const {active: column, direction} = event;
    this.store.dispatch(new psa.SortByColumnAction(column, direction));
  }

  rowClassifier(row: Proposal): string {
    /*if (row.size === 0) {
      return 'row-empty';
    } else {
      return 'row-generic';
    }*/
    return 'row-generic';
  }
}
