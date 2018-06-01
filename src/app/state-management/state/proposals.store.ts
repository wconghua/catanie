import {Proposal, Dataset, ProposalFilters} from '../models';

export interface ProposalsState {
  proposals: Proposal[];
	datasets: {[datasetId: string]: Dataset};
  activeFilters: ProposalFilters;
  filterValues: object;
	hasFetched: boolean,
	selectedId: string,
  totalProposals: number;
  loading: boolean;
  currentPage3: number;
  itemsPerPage3: number;

};

export const initialProposalsState: ProposalsState = {
  proposals: [],
	datasets: {},
  activeFilters: <ProposalFilters>{
    text: null,
    creationTime: null,
    title: null,
    skip: 0,
    initial: true,
    sortField: 'createdAt desc',
  },
  filterValues: {
    creationTime: {start: null, end: null},
    text: null,
    title: null,
  },
	hasFetched: false,
	selectedId: null,
  totalProposals: 0,
  loading: false,
  currentPage3: 0,
  itemsPerPage3: 30
};


