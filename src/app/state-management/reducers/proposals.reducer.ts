import { ProposalsState, initialProposalsState } from '../state/proposals.store';

import {
  ProposalsAction,
  SelectProposalAction, SELECT_PROPOSAL,
  FetchProposalsCompleteAction, FETCH_PROPOSALS_COMPLETE,
  FetchProposalCompleteAction, FETCH_PROPOSAL_COMPLETE,
  FetchDatasetsForProposalCompleteAction, FETCH_DATASETS_FOR_PROPOSAL_COMPLETE,
  FILTER_PROPOSALS_UPDATE, FILTER_PROPOSALS_VALUE_UPDATE, FILTER_PROPOSALS_UPDATE_COMPLETE, TOTAL_PROPOSALS_UPDATE,
  GoToPageAction, GO_TO_PAGE, SORT_BY_COLUMN, SortByColumnAction
} from '../actions/proposals.actions';

import { LogoutCompleteAction, LOGOUT_COMPLETE } from '../actions/user.actions';

export function proposalsReducer(
    state: ProposalsState = initialProposalsState,
    action: ProposalsAction | LogoutCompleteAction
): ProposalsState {
    switch (action.type) {
        case SELECT_PROPOSAL:
            const selectedId = (action as SelectProposalAction).proposalId;
            return {...state, selectedId};

        case FETCH_PROPOSALS_COMPLETE: {
            const proposals = (action as FetchProposalsCompleteAction).proposals;
            return {...state, proposals, hasFetched: true};
        }
        case FETCH_PROPOSAL_COMPLETE: {
            const proposal = (action as FetchProposalCompleteAction).proposal;
            const proposals = {...state.proposals, [proposal.proposalId]: proposal};
            return {...state, proposals};
        }
        case FETCH_DATASETS_FOR_PROPOSAL_COMPLETE: {
            const list = (action as FetchDatasetsForProposalCompleteAction).datasets;
            const datasets = list.reduce((datasets, dataset) =>
                ({...datasets, [dataset.pid]: dataset})
            , {});
            return {...state, datasets};
        }
        case FILTER_PROPOSALS_UPDATE: {
          const f = action['payload'];
          const group = f['ownerGroup'];
          if (group && !Array.isArray(group) && group.length > 0) {
            f['ownerGroup'] = [group];
          }
          return {...state, activeFilters: f, };
        }
        case FILTER_PROPOSALS_VALUE_UPDATE:
        case FILTER_PROPOSALS_UPDATE_COMPLETE: {
          const filterValues = action['payload'];
          return {...state, filterValues};
        }
        case TOTAL_PROPOSALS_UPDATE: {
          const totalProposals = <number>action['payload'];
          return {...state, totalProposals};
        }
        case GO_TO_PAGE: {
          const page = (action as GoToPageAction).page;
          const skip = page * state.itemsPerPage3;
          const activeFilters = {...state.activeFilters, skip};
          return {
            ...state,
            activeFilters,
            currentPage3: page
          };
        }
        case SORT_BY_COLUMN:{
          const {column, direction} = action as SortByColumnAction;
          const sortField = column + ' ' + direction;
          const activeFilters = {...state.activeFilters, sortField};
          return {...state, activeFilters};
        }
        case LOGOUT_COMPLETE:
            return {...initialProposalsState};

        default:
            return state;
    }
};
