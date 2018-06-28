import {combineReducers } from '@ngrx/store';
import { datasetsReducer } from 'state-management/reducers/datasets.reducer';
import { jobsReducer } from 'state-management/reducers/jobs.reducer';
import { userReducer } from 'state-management/reducers/user.reducer';
import { DatasetState, initialDatasetState } from 'state-management/state/datasets.store';
import { initialJobsState, JobsState } from 'state-management/state/jobs.store';
import { initialUserState, UserState } from 'state-management/state/user.store';
import * as ua from 'state-management/actions/user.actions';

export interface AppState {
    datasets: DatasetState;
    user: UserState;
    jobs: JobsState;
}

export const initialState: AppState = {
    datasets: initialDatasetState,
    user: initialUserState,
    jobs: initialJobsState,
};

const appReducer = combineReducers({
    user: userReducer,
    datasets: datasetsReducer,
    jobs: jobsReducer,
 });

export const rootReducer = (state, action) => {
    if (action.type === ua.LOGOUT_COMPLETE) {
        state = undefined;
    }

    return appReducer(state, action);
};

export const getDatasetsState = (state: any) => state.root.datasets;

// export const getDatasets = createSelector(getDatasetsState, datasetsReducer.getDatasets);
// export const getActiveFilters = createSelector(getDatasetsState, datasetsReducer.getActiveFilters);
// export const getFilterValues = createSelector(getDatasetsState, datasetsReducer.getFilterValues);

export const getUserState = (state: AppState) => state.user;
