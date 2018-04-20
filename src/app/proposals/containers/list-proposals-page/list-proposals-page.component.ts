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
import { FetchProposalsAction, SelectProposalAction } from 'state-management/actions/proposals.actions';
import {MatTableDataSource} from "@angular/material";
import * as selectors from "../../../state-management/selectors";
import {Dataset} from "../../../state-management/models";
import {Router} from "@angular/router";
import {ConfigService} from "../../../shared/services/config.service";
import {getSelectedProposalDatasets} from "../../../state-management/selectors/proposals.selectors";
import {DatePipe} from "@angular/common";
import {config} from "../../../../config/config";

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

    dataSource: MatTableDataSource<any> | null;
    subscriptions = [];
    cols = [];
    @Input() proposals2 = [];
    //displayedColumns = ['proposalId', 'title'];
    displayedColumns = [];

  constructor(private store: Store<AppState>,
              private configSrv: ConfigService,
              private router: Router,) {}


    ngOnInit() {
        this.proposals$ = this.store.pipe(select(getProposalList));

      this.configSrv.getConfigFile('Proposal').subscribe(conf => {
        if (conf) {
          for (const prop in conf) {
            if (prop in conf && 'table' in conf[prop]) {
              this.cols.push(conf[prop]['table']);
              this.displayedColumns.push(conf[prop]['table']['field']);
            }
          }
        }
      });


      this.subscriptions.push(
          this.store.select(selectors.proposals.getProps).subscribe(
            data => {
              this.proposals2 = data;
              this.dataSource = new MatTableDataSource(this.proposals2);
              //this.dataSource.sort = this.sort;
              //this.updateRowView(this.mode);

            },
            error => {
              console.error(error);
            }
          )
        );

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

    /*calculateRowClasses(row: Proposal) {
      return {'row-generic': true};
    }*/

    /**
     * Navigate to proposal detail page
     * on a row click
     * @param {any} event
     * @memberof ProposalTableComponent
     */
    /*onRowSelect(event, row) {
      const pid = encodeURIComponent(row.pid);
      this.router.navigateByUrl(
        '/proposal/' + pid
      );
    }*/
  getRowValue(row, col) {
    const field = col.field;
    const value = row[field];

    /*if (field === 'creationTime') {
      const date = new Date(value);
      const datePipe = new DatePipe('en-US');
      const formattedDate = datePipe.transform(date, 'dd/MM/yyyy HH:mm');
      return formattedDate;
    }*/

    return value;
  }
};
