import { Component, Input } from '@angular/core';
import { Proposal } from 'state-management/models';
import { Router } from '@angular/router';

@Component({
    selector: 'proposals-list',
    templateUrl: 'proposals-list.component.html',
    styleUrls: ['proposals-list.component.scss']
})
export class ProposalsListComponent {
    @Input() proposals: Proposal[];
    private displayedColumns: string[] = ['proposalId','title', 'abstract'];

  constructor(private router: Router,){};

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
}
