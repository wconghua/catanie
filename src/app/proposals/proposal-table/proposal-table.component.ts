import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';

import { Router, ActivatedRoute, Data } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatSort, MatDialog } from '@angular/material';

import { Proposal } from 'shared/sdk/models';
import { ConfigService } from 'shared/services/config.service';

import * as psa from 'state-management/actions/proposals.actions';
import { Observable } from 'rxjs/Observable';

import { PageChangeEvent, SortChangeEvent } from '../proposal-table-pure/proposal-table-pure.component';

import {AfterViewInit} from "@angular/core/src/metadata/lifecycle_hooks";

@Component({
  selector: 'proposal-table',
  templateUrl: './proposal-table.component.html',
  styleUrls: ['./proposal-table.component.scss']
})
export class ProposalTableComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() private openProposal = new EventEmitter();

  @Input() private proposals$: Observable<Proposal[]>;
  @Input() private currentPage: Observable<number>;
  @Input() private proposalCount$: Observable<number>;

  // compatibility analogs of observables
  @Input() private loading: Observable<boolean>;
  @Input() private limit: Observable<number>;

  @Input() private matSort: MatSort;
  @Input() private searchText$;
  tooltipPos = 'below';

  constructor(
    private router: Router,
    private configSrv: ConfigService,
    private route: ActivatedRoute,
    private store: Store<any>,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {}

  setCurrentPage(n: number) {
  }

  ngAfterViewInit() {
  }

  onClick(proposal: Proposal): void {
    const proposalId = encodeURIComponent(proposal.proposalId);
    this.router.navigateByUrl('/proposals/' + proposalId);
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

  /**
   * Handles free text search.
   * Need to determine best way to search mongo fields
   * @param {any} customTerm - free text search term@memberof ProposalTableComponent
   */
  textSearch(terms) {
    this.store
      .select(state => state.proposals.activeFilters)
      .take(1)
      .subscribe(values => {
        const filters = Object.assign({}, values);
        filters['text'] = terms;
        this.store.dispatch(new psa.UpdateProposalFilterAction(filters));
      });
  }

}
