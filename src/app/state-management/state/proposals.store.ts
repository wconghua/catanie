import { Proposal, Dataset } from '../models';
import * as lb from "../../shared/sdk/models";

export interface ProposalsState {
	proposals: {[proposalId: string]: Proposal};
	datasets: {[datasetId: string]: Dataset};
	hasFetched: boolean,
	selectedId: string,
  listp: lb.Proposal[];
};

export const initialProposalsState: ProposalsState = {
	proposals: {},
	datasets: {},
	hasFetched: false,
	selectedId: null,
  listp: [],
};
