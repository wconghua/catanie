import {DatasetState, initialDatasetState} from 'state-management/state/datasets.store';
import {UserState, initialUserState} from 'state-management/state/user.store';
import {JobsState, initialJobsState} from 'state-management/state/jobs.store';
import {ProposalsState, initialProposalsState} from "./proposals.store";

export interface AppState {
    datasets: DatasetState;
    user: UserState;
    jobs: JobsState;
    proposals: ProposalsState;
}

export const initialState: AppState = {
    datasets: initialDatasetState,
    user: initialUserState,
    jobs: initialJobsState,
    proposals: initialProposalsState,
};
