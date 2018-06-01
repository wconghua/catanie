import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { map, mergeMap, take, catchError } from 'rxjs/operators';
import * as lb from 'shared/sdk/services';
import { ProposalsService } from 'proposals/proposals.service';
import 'rxjs/add/operator/withLatestFrom';

import {

  FetchProposalsCompleteAction,
  FetchProposalsFailedAction,

  FetchProposalOutcomeAction,
  FetchProposalAction, FETCH_PROPOSAL,
  FetchProposalCompleteAction,
  FetchProposalFailedAction,

  FetchDatasetsForProposalOutcomeAction,
  FetchDatasetsForProposalAction, FETCH_DATASETS_FOR_PROPOSAL,
  FetchDatasetsForProposalCompleteAction,
  FetchDatasetsForProposalFailedAction,
  UpdateProposalFilterAction, FILTER_PROPOSALS_UPDATE,
  TotalProposalsAction,
  SearchProposalsFailedAction, GO_TO_PAGE, SORT_BY_COLUMN
} from '../actions/proposals.actions';

import { Proposal } from '../models';
import {getActiveFilters} from "../selectors/proposals.selectors";
import {AppState} from "../state/app.store";

@Injectable()
export class ProposalsEffects {

  @Effect()
  protected facetProposalCount$: Observable<Action> =
    this.actions$.ofType(FILTER_PROPOSALS_UPDATE)
      .debounceTime(300)
      .map((action: UpdateProposalFilterAction) => action.payload)
      .switchMap(payload => {
        const limits = {};
        if (payload['text']) {
          const searchText = "%" + payload['text'] + "%";
          limits['where'] = {"or": [{title: {"like": searchText}},{abstract: {"like": searchText}}]};
        }
        return this.ps
          .count(limits)
          .map(res => new TotalProposalsAction(res.count))
          .catch(err => Observable.of(new SearchProposalsFailedAction(err)));
      });

  @Effect()
  protected facetProposals$: Observable<Action> =
    this.actions$.ofType(FILTER_PROPOSALS_UPDATE)
      .debounceTime(300)
      .map((action: UpdateProposalFilterAction) => action.payload)
      .switchMap(payload => {
        const limits= {};
        limits['limit'] = payload['limit'] ? payload['limit'] : 30;
        limits['skip'] = payload['skip'] ? payload['skip'] : 0;
        limits['order'] = payload['sortField'] ? payload['sortField'] : "createdAt desc";
        if (payload['text']) {
          const searchText = "%" + payload['text'] + "%";
          limits['where'] = {"or": [{"title": {"like": searchText}},{"abstract": {"like": searchText}}]};
        }
      return this.ps.find (limits)
        .switchMap(res => {
          console.log(res);
          return Observable.of(new FetchProposalsCompleteAction(res as Proposal[]));
        })
        .catch(err => {
          console.log(err);
          return Observable.of(new FetchProposalsFailedAction());
        });
    });

@Effect()
protected triggerFacetProposals$: Observable<Action> =
  this.actions$.ofType(GO_TO_PAGE, SORT_BY_COLUMN)
    .withLatestFrom(this.store.select(getActiveFilters))
    .map(([action, filter]) => {
      return new UpdateProposalFilterAction(filter);
    });

	@Effect() getProposal$: Observable<FetchProposalOutcomeAction> = this.actions$.pipe(
		ofType<FetchProposalAction>(FETCH_PROPOSAL),
		mergeMap(action =>
			this.proposalsService.getProposal(action.proposalId).pipe(
				map(proposal => new FetchProposalCompleteAction(proposal)),
				catchError(() => Observable.of(new FetchProposalFailedAction()))
			)
		)
	);

	@Effect() getDatasetsForProposal$: Observable<FetchDatasetsForProposalOutcomeAction> = this.actions$.pipe(
		ofType<FetchDatasetsForProposalAction>(FETCH_DATASETS_FOR_PROPOSAL),
		mergeMap(action =>
			this.proposalsService.getDatasetsForProposal(action.proposalId).pipe(
				map(datasets => new FetchDatasetsForProposalCompleteAction(datasets)),
				catchError(() => Observable.of(new FetchDatasetsForProposalFailedAction()))
			)
		)
	);

	constructor(
		private actions$: Actions,
		private proposalsService: ProposalsService,
    private ps: lb.ProposalApi,
    private store: Store<AppState>
	) {}
}
