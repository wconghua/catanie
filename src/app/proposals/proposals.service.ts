import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ProposalApi, DatasetApi } from 'shared/sdk/services';
import { Proposal, Dataset } from 'shared/sdk/models';
import {Subject} from "rxjs/Subject";

@Injectable()
export class ProposalsService {
  limit = 30;
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

	getProposalBySearchText(searchText: string): Observable<Proposal[]> {
	  const query  ={"where": {"title":{"like": "%" +searchText +"%"}}};
	  return this.proposalApi.find(query);
  }

	getDatasetsForProposal(proposalId: string): Observable<Dataset[]> {
		return this.datasetApi.find({where: {proposalId}});
	}

}
