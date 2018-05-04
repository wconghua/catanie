import { Action, ActionReducer } from '@ngrx/store';
import { ProposalsState, initialProposalsState } from '../state/proposals.store';

import {
    ProposalsAction,
    SelectProposalAction, SELECT_PROPOSAL,
    FetchProposalsCompleteAction, FETCH_PROPOSALS_COMPLETE,
    FetchProposalCompleteAction, FETCH_PROPOSAL_COMPLETE,
    FetchDatasetsForProposalCompleteAction, FETCH_DATASETS_FOR_PROPOSAL_COMPLETE,
    FILTER_PROPOSALS_UPDATE, FILTER_PROPOSALS_VALUE_UPDATE, FILTER_PROPOSALS_UPDATE_COMPLETE, TOTAL_PROPOSALS_UPDATE
} from '../actions/proposals.actions';

import { LogoutCompleteAction, LOGOUT_COMPLETE } from '../actions/user.actions';
import {getSelectedProposalId} from "../selectors/proposals.selectors";
import {FILTER_UPDATE, FILTER_UPDATE_COMPLETE, FILTER_VALUE_UPDATE, TOTAL_UPDATE} from "../actions/datasets.actions";

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
        case LOGOUT_COMPLETE:
            return {...initialProposalsState};

        default:
            return state;
    }
};
