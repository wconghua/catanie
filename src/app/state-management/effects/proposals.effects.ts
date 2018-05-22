import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';
import { map, mergeMap, take, catchError } from 'rxjs/operators';
import * as lb from 'shared/sdk/services';
import { ProposalsService } from 'proposals/proposals.service';
import 'rxjs/add/operator/withLatestFrom';

import {
  FetchProposalsOutcomeAction,
  FetchProposalsAction, FETCH_PROPOSALS,
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
  UpdateProposalFilterAction, FILTER_PROPOSALS_UPDATE, SearchProposalCompleteAction,
  TotalProposalsAction, TOTAL_PROPOSALS_UPDATE, ProposalsAction,
  SearchProposalsFailedAction, GO_TO_PAGE, SORT_BY_COLUMN
} from '../actions/proposals.actions';

import { Proposal } from '../models';
import * as DatasetActions from "../actions/datasets.actions";
import {ProposalApi} from "../../shared/sdk/services/custom/Proposal";
import {getActiveFilters} from "../selectors/proposals.selectors";
import {AppState} from "../state/app.store";

@Injectable()
export class ProposalsEffects {
	/*@Effect() getProposals$: Observable<FetchProposalsOutcomeAction> = this.actions$.pipe(
		ofType<FetchProposalsAction>(FETCH_PROPOSALS),
		mergeMap(action =>
			this.proposalsService.getProposals().pipe(
				map(proposals => new FetchProposalsCompleteAction(proposals)),
				catchError(() => Observable.of(new FetchProposalsFailedAction()))
			)
		)
	);*/


  @Effect() getProposals$: Observable<FetchProposalsOutcomeAction> =
    this.actions$.ofType(FETCH_PROPOSALS)
    .debounceTime(300)
    .map((action: UpdateProposalFilterAction) => action.payload)
    .switchMap(payload => {
      const limits= {};
      limits['limit'] = payload['limit'] ? payload['limit'] : 30;
      limits['skip'] = payload['skip'] ? payload['skip'] : 0;
      limits['order'] = payload['sortField'] ? payload['sortField'] : "createdAt:desc";
      // remove fields not relevant for facet filters
      // TODO understand what defines the structure of the payload.
      // TODO What is the meaning of "initial"
      const fq={}
      Object.keys(payload).forEach(key => {
        // console.log("======key,payload[key]",key,payload[key])
        if (['initial','sortField','skip','limit'].indexOf(key)>=0)return
        if (payload[key] === null) return
        if (typeof payload[key] === 'undefined' || payload[key].length == 0) return
        fq[key]=payload[key]
      })

      return this.proposalsService.getFilteredProposals(limits).pipe(
        map(proposals => new FetchProposalsCompleteAction(proposals)),
        catchError(() => Observable.of(new FetchProposalsFailedAction())
        ));
    });

  @Effect() getProposalsCount$: Observable<FetchProposalsOutcomeAction> = this.actions$.pipe(
    ofType<FetchProposalsAction>(FETCH_PROPOSALS),
    mergeMap(action =>
      this.proposalsService.getProposals().pipe(
        map(proposals => new FetchProposalsCompleteAction(proposals)),
        catchError(() => Observable.of(new FetchProposalsFailedAction()))
      )
    )
  );

  /*@Effect() getFilteredProposals$: Observable<FetchProposalsOutcomeAction> = this.actions$.pipe(
    ofType<FetchProposalsAction>(FETCH_PROPOSALS),
    mergeMap(action =>
      this.proposalsService.getFilteredProposals().pipe(
        map(proposals => new FetchProposalsCompleteAction(proposals)),
        catchError(() => Observable.of(new FetchProposalsFailedAction()))
      )
    )
  );*/


  /*@Effect()
  protected fetchFilteredProposals$: Observable<Action> =
    this.actions$.ofType(FILTER_PROPOSALS_UPDATE)
      .map((action: UpdateProposalFilterAction) => action.payload)
      .switchMap(payload => {
        const filter = {};
        const fq = Object.assign({}, payload);
        filter['limit'] = fq['limit'] ? fq['limit'] : 30;
        return this.proposalsService
            .searchProposalsObservable(filter)
            .switchMap(res => {
              console.log(res);
              return Observable.of(new SearchProposalCompleteAction(res));
            })
            .catch(err => {
              console.log(err);
              return Observable.of(new FetchProposalsFailedAction());
            });
        }
      );*/
  @Effect()
  protected facetProposalCount$: Observable<Action> =
    this.actions$.ofType(FILTER_PROPOSALS_UPDATE)
      .debounceTime(300)
      .map((action: UpdateProposalFilterAction) => action.payload)
      .switchMap(payload => 
        this.ps
          .count()
          .map(res => new TotalProposalsAction(res.count))
          .catch(err => Observable.of(new SearchProposalsFailedAction(err)))
      );

  /*@Effect()
  protected facetProposals$: Observable<Action> =
    this.actions$.ofType(FILTER_PROPOSALS_UPDATE)
      .debounceTime(300)
      .map((action: UpdateProposalFilterAction) => action.payload)
      .switchMap(payload => {
        const limits= {};
        limits['limit'] = payload['limit'] ? payload['limit'] : 30;
        limits['skip'] = payload['skip'] ? payload['skip'] : 0;
        limits['order'] = payload['sortField'] ? payload['sortField'] : "createdAt:desc";
        // remove fields not relevant for facet filters
        // TODO understand what defines the structure of the payload.
        // TODO What is the meaning of "initial"
        const fq={}
        Object.keys(payload).forEach(key => {
          // console.log("======key,payload[key]",key,payload[key])
          if (['initial','sortField','skip','limit'].indexOf(key)>=0)return
          if (payload[key] === null) return
          if (typeof payload[key] === 'undefined' || payload[key].length == 0) return
          fq[key]=payload[key]
        })
        return this.ps.fullquery (limits)
          .switchMap(res => {
            console.log(res);
            return Observable.of(new FetchProposalsCompleteAction(res as Proposal[]));
          })
          .catch(err => {
            console.log(err);
            return Observable.of(new FetchProposalsFailedAction());
          });
      });*/

  @Effect()
  protected facetProposals$: Observable<Action> =
    this.actions$.ofType(FILTER_PROPOSALS_UPDATE)
    .debounceTime(300)
    .map((action: UpdateProposalFilterAction) => action.payload)
    .switchMap(payload => {
      const fq = Object.assign({}, payload);
      const match = handleFacetPayload(fq, true);
      const filter = {};
      if (match.length > 1) {
        filter['where'] = {};

        filter['where']['and'] = match;
      } else if (match.length === 1) {
        filter['where'] = match[0];
      }

      filter['limit'] = fq['limit'] ? fq['limit'] : 30;
      filter['skip'] = fq['skip'] ? fq['skip'] : 0;
      if (fq['sortField']) {
        filter['order'] = fq['sortField'];
      }
      return this.ps.find (filter)
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

/*@Effect()
protected getProposalsCount$: Observable<Action> =
this.actions$.ofType(FILTER_PROPOSALS_UPDATE)
  .map((action: UpdateProposalFilterAction) => action.payload)
  .switchMap(payload => {
    const filter = {};
    const fq = Object.assign({}, payload);
    filter['limit'] = fq['limit'] ? fq['limit'] : 30;
    return this.ps.count(filter)
        .switchMap(res => {
          console.log(res);
          return Observable.of(new TotalProposalsAction(res['count']));
        })
        .catch(err => {
          console.log(err);
          return Observable.of(new FetchProposalsFailedAction());
        });
    }
  );
*/
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

/**
 * Create a filter query to be handled by loopback for datasets and facets
 * @param fq The fields to construct the query from
 * @param loopback If using Loopback or mongo syntax. Check the docs for differences but mainly on array vs object structure
 */
function handleFacetPayload(fq, loopback = false) {
  const match: any = loopback ? [] : {};
  const f = Object.assign({}, fq);
  delete f['initial'];
  delete f['sortField'];
  delete f['skip'];

  Object.keys(f).forEach(key => {
    let facet = f[key];
    if (facet) {
      switch (key) {
        case 'ownerGroup':
          if (facet.length > 0 && facet.constructor !== Array &&
            typeof facet[0] === 'object') {
            const groupsArray = [];
            const keys = Object.keys(facet[0]);

            for (let i = 0; i < keys.length; i++) {
              groupsArray.push(facet[0][keys[i]]);
            }

            facet = groupsArray;
          }
          if (facet.length > 0) {
            if (loopback) {
              match.push({ownerGroup: {inq: facet}});
            } else {
              match[key] = {$in: facet};
            }
          }
          break;
        case 'text':
          if (loopback) {
            match.push({'$text': {'search': '"' + facet + '"', 'language': 'none'}});
          } else {
            match['$text'] = facet;
          }
          break;
        case 'createdAt':
          const start = facet['begin'] || undefined;
          const end = facet['end'] || undefined;
          if (start && end) {
            if (loopback) {
              match.push({creationTime: {gte: start}});
              match.push({creationTime: {lte: end}});
            } else {
              match['createdAt'] = {$gte: start, $lte: end};
            }
          }
          break;
        case 'type':
          if (loopback) {
            match.push({'type': facet});
          } else {
            match['type'] = facet;
          }
          break;
        default:
          // TODO handle default case for array and text types in Mongo (defaults to array)
          const obj = {};
          if (loopback && facet.length > 0) {
            obj[key] = {inq: facet};
            match.push(obj);
          } else if (facet.length > 0) {
            match[key] = {'$in': facet};
          }
          break;
      }
    }
  });
  //console.log("Resulting match expression:",match)
  return match;
}

function stringSort(a, b) {
  const val_a = a._id,
    val_b = b._id;
  if (val_a < val_b) {
    return -1;
  }
  if (val_a > val_b) {
    return 1;
  }
  return 0;
}


