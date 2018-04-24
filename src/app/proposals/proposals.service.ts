import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ProposalApi, DatasetApi } from 'shared/sdk/services';
import { Proposal, Dataset } from 'shared/sdk/models';
import {Subject} from "rxjs/Subject";

@Injectable()
export class ProposalsService {
  limit = 1000;
  loading = false;
  proposals: Array<Proposal> = [];
  proposalChange: Subject<string> = new Subject<string>();
  filter = {
    limit: this.limit,
  };


	constructor(
		private proposalApi: ProposalApi,
		private datasetApi: DatasetApi,
	) {}

	getProposals(): Observable<Proposal[]> {
		return this.proposalApi.find();
	}

	getProposal(proposalId: string): Observable<Proposal> {
		return this.proposalApi.findOne({where: {proposalId}});
	}

	getDatasetsForProposal(proposalId: string): Observable<Dataset[]> {
		return this.datasetApi.find({where: {proposalId}});
	}

  getFilteredProposals(terms: object = this.filter): Observable<Proposal[]> {
    const filter = Object.assign(terms, this.filter);
    return this.proposalApi.find(filter);
  }

}
