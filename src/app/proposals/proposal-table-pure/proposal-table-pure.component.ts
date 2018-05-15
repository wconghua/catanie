import {Component, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import { Proposal } from 'state-management/models';
import {MatSort} from "@angular/material";

export interface PageChangeEvent {
  pageIndex: number;
  pageSize: number;
  length: number;
}

export interface SortChangeEvent {
  active: keyof Proposal;
  direction: 'asc' | 'desc' | '';
}

@Component({
  selector: 'proposal-table-pure',
  templateUrl: './proposal-table-pure.component.html',
  styleUrls: ['./proposal-table-pure.component.scss']
})
export class ProposalTablePureComponent {
  @Input() private proposals: Proposal[];
  @Input() private totalNumber: number;
  @Input() private currentPage: number;
  @Input() private rowClassifier?: (proposal: Proposal) => string;

  @Input() private matSort: MatSort;

  @Output() private onClick: EventEmitter<Proposal> = new EventEmitter();
  @Output() private onPageChange: EventEmitter<PageChangeEvent> = new EventEmitter();
  @Output() private onSortChange: EventEmitter<SortChangeEvent> = new EventEmitter();

  private displayedColumns: string[] = [
    //'select',
    'proposalId',
    'title',
    'abstract',
    'createdAt',
  ];

  private getRowClass(proposal): {[key: string]: boolean} {
    if (this.rowClassifier) {
      const cls = this.rowClassifier(proposal);
      return {[cls]: true};
    } else {
      return {};
    }
  }

  private handleClick(proposal): void {
    this.onClick.emit(proposal);
  }

  private handlePageChange(event: PageChangeEvent): void {
    this.onPageChange.emit(event);
  }

  private handleSortChange(event: SortChangeEvent): void {
    this.onSortChange.emit(event);
  }
}
