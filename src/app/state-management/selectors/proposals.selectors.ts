import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ProposalsState } from '../state/proposals.store';


const getProposalsState = createFeatureSelector<ProposalsState>('proposals');

export const getProposals = createSelector(
	getProposalsState,
	state => state.proposals
);

const getDatasets = createSelector(
	getProposalsState,
	state => state.datasets
);

const getDatasetList = createSelector(
	getDatasets,
	datasets => Object.keys(datasets).map(id => datasets[id])
);

export const getSelectedProposalId = createSelector(
	getProposalsState,
	state => state.selectedId
);

export const getSelectedProposal = createSelector(
	getProposals,
	getSelectedProposalId,
	(proposals, selectedId) => proposals[selectedId] || null
);

export const getCurrentProposal = createSelector(
  getProposalsState,
  state => state.currentProposal
);

export const getSelectedProposalDatasets = createSelector(
	getDatasetList,
	getSelectedProposalId,
	(datasets, proposalId) => datasets.filter(dataset => dataset.pid === proposalId)
);

export const getPage = createSelector(
  getProposalsState,
  state => state.currentPage3
);

export const getLoading = (state: any) => state.proposals.loading;
export const getTotalSets = (state: any) => state.proposals.totalProposals;
export const getFilterValues = (state: any) => state.proposals.filterValues;
export const getActiveFilters = (state: any) => state.proposals.activeFilters;

export const getText = (state: any) => state.proposals.activeFilters.text;




