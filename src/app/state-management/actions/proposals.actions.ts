import { Action } from '@ngrx/store';
import { Proposal, Dataset } from '../models';
import {
  FILTER_UPDATE,
  FILTER_UPDATE_COMPLETE,
  FILTER_VALUE_UPDATE,
  SEARCH_COMPLETE,
  TOTAL_UPDATE
} from "./datasets.actions";

export const SELECT_PROPOSAL			= '[Proposals] Select Proposal';

export const FETCH_PROPOSALS    		= '[Proposals] Get Proposals';
export const FETCH_PROPOSALS_COMPLETE 	= '[Proposals] Get Proposals Complete';
export const FETCH_PROPOSALS_FAILED		= '[Proposals] Get Proposals Failed'

export const FETCH_PROPOSAL             = '[Proposals] Get Proposal';
export const FETCH_PROPOSAL_COMPLETE    = '[Proposals] Get Proposal Complete';
export const FETCH_PROPOSAL_FAILED      = '[Proposals] Get Proposal Failed';

export const FETCH_DATASETS_FOR_PROPOSAL            = '[Proposals] Fetch Datasets for Proposal';
export const FETCH_DATASETS_FOR_PROPOSAL_COMPLETE   = '[Proposals] Fetch Datasets for Proposal Complete';
export const FETCH_DATASETS_FOR_PROPOSAL_FAILED     = '[Proposals] Fetch Datasets for Proposal Failed';
export const FILTER_PROPOSALS_UPDATE =                '[Proposals] Filter Update';
export const FILTER_PROPOSALS_VALUE_UPDATE =                '[Proposals] Filter Value Update';
export const FILTER_PROPOSALS_UPDATE_COMPLETE =                '[Proposals] Filter Update Complete';

export const SEARCH_PROPOSALS_COMPLETE =                '[Proposals] Search Proposals Complete';
export const SEARCH_PROPOSALS_FAILED=                '[Proposals] Search Proposals Failed';

export const TOTAL_PROPOSALS_UPDATE =    '[Proposals] Total Proposals Update';

export const GO_TO_PAGE =                   '[Proposal] Go to Page';
export const SORT_BY_COLUMN =               '[Proposal] Sort by Column';


export class SelectProposalAction implements Action {
    type = SELECT_PROPOSAL;
    constructor(readonly proposalId: string) {}
}

export class FetchProposalsAction implements Action {
    type = FETCH_PROPOSALS;
}

export class FetchProposalsCompleteAction implements Action {
    type = FETCH_PROPOSALS_COMPLETE;
    constructor(readonly proposals: Proposal[]) {}
}

export class FetchProposalsFailedAction implements Action {
    type = FETCH_PROPOSALS_FAILED;
}

export class FetchProposalAction implements Action {
    type = FETCH_PROPOSAL;
    constructor(readonly proposalId: string) {};
}

export class FetchProposalCompleteAction implements Action {
    type = FETCH_PROPOSAL_COMPLETE;
    constructor(readonly proposal: Proposal) {};
}

export class FetchProposalFailedAction implements Action {
    type = FETCH_PROPOSAL_FAILED;
}

export class FetchDatasetsForProposalAction implements Action {
    type = FETCH_DATASETS_FOR_PROPOSAL;
    constructor(readonly proposalId: string) {};
}

export class FetchDatasetsForProposalCompleteAction implements Action {
    type = FETCH_DATASETS_FOR_PROPOSAL_COMPLETE;
    constructor(readonly datasets: Dataset[]) {};
}

export class FetchDatasetsForProposalFailedAction implements Action {
    type = FETCH_DATASETS_FOR_PROPOSAL_FAILED;
}

export class UpdateProposalFilterAction implements Action {
  readonly type = FILTER_PROPOSALS_UPDATE;
  constructor(public payload: any) {}
}

export class UpdateProposalFilterCompleteAction implements Action {
  readonly type = FILTER_UPDATE_COMPLETE;
  constructor(public payload: any) {}
}

export class FilterProposalValueAction implements Action {
  readonly type = FILTER_PROPOSALS_VALUE_UPDATE;
  constructor(public payload?: any) {}
}

export class SearchProposalCompleteAction implements Action {
  readonly type = SEARCH_PROPOSALS_COMPLETE;
  constructor(public payload: {}[]) {}
}

export class TotalProposalsAction implements Action {
  readonly type = TOTAL_PROPOSALS_UPDATE;
  constructor(public payload: number) {}
}

export class GoToPageAction implements Action {
  readonly type = GO_TO_PAGE;
  constructor(readonly page: number) {}
}

export class SortByColumnAction implements Action {
  readonly type = SORT_BY_COLUMN;
  constructor(readonly column: string, readonly direction: string) {}
}

export class SearchProposalsFailedAction implements Action {
  readonly type = SEARCH_PROPOSALS_FAILED;
  constructor(public payload: any) {}
}





export type FetchProposalsOutcomeAction =
	FetchProposalsCompleteAction |
    FetchProposalsFailedAction;

export type FetchProposalOutcomeAction =
    FetchProposalCompleteAction |
    FetchProposalFailedAction;

export type FetchDatasetsForProposalOutcomeAction =
    FetchDatasetsForProposalCompleteAction |
    FetchDatasetsForProposalFailedAction;

export type ProposalsAction =
    SelectProposalAction |
    FetchProposalsAction | FetchProposalsOutcomeAction |
    FetchProposalAction | FetchProposalOutcomeAction |
    FetchDatasetsForProposalAction | FetchDatasetsForProposalOutcomeAction |
    SearchProposalCompleteAction | UpdateProposalFilterAction |TotalProposalsAction |
    GoToPageAction | SortByColumnAction | SearchProposalsFailedAction;
