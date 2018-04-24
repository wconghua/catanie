import { Component, Input, ViewChild } from '@angular/core';
import { Proposal } from 'state-management/models';
import { Router } from '@angular/router';
import {MatPaginator, MatTableDataSource} from "@angular/material";
import {AppState} from "../../../state-management/state/app.store";
import {Store} from "@ngrx/store";
import * as selectors from "../../../state-management/selectors";
import * as dsa from "../../../state-management/actions/proposals.actions";
import {UpdateProposalFilterAction} from "../../../state-management/actions/proposals.actions";

@Component({
    selector: 'proposals-list',
    templateUrl: 'proposals-list.component.html',
    styleUrls: ['proposals-list.component.scss']
})
export class ProposalsListComponent {
    @Input() proposals: Proposal[];
    //@Input() dataSource : Proposal[];
    private displayedColumns: string[] = ['proposalId','title', 'abstract'];
    @Input() proposalsCount;
    @Input() dataSource;
    //dataSource: MatTableDataSource<any> | null;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    constructor(
      private router: Router,
      private store: Store<AppState>,
      ){};

  /**
   * Navigate to proposal detail page
   * on a row click
   * @param {any} event
   * @memberof DatasetTableComponent
   */
  onRowSelect(event, row) {
    const proposalId = encodeURIComponent(row.proposalId);
    this.router.navigateByUrl(
      '/proposals/' + proposalId
    );
  }

  ngAfterViewInit() {
    //this.dataSource$.paginator = this.paginator;
    this.dataSource.paginator = this.paginator;
    /*if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      //this.dataSource.sort = this.sort;
    }*/

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



}
