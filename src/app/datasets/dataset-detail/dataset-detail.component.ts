import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store, select} from '@ngrx/store';
import {Job} from 'shared/sdk/models';
import * as dsa from 'state-management/actions/datasets.actions';
import * as ja from 'state-management/actions/jobs.actions';
import * as ua from 'state-management/actions/user.actions';
import * as selectors from 'state-management/selectors';
import {Subscription} from 'rxjs/Subscription';
import { Message, MessageType } from 'state-management/models';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { getIsAdmin } from 'state-management/selectors/users.selectors';
import { getCurrentDataset, getCurrentDatablocks, getCurrentAttachments, getCurrentOrigDatablocks } from 'state-management/selectors/datasets.selectors';
import { pluck, take } from 'rxjs/operators';
import * as filesize from 'filesize';

/**
 * Component to show details for a dataset, using the
 * form compoennt
 * @export
 * @class DatasetDetailComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'dataset-detail',
  templateUrl: './dataset-detail.component.html',
  styleUrls: ['./dataset-detail.component.scss']
})
export class DatasetDetailComponent implements OnInit, OnDestroy {  
  private subscriptions: Subscription[] = [];
  private routeSubscription = this.route.params
    .pipe(pluck('id'))
    .subscribe((id: string) => this.store.dispatch(new dsa.DatablocksAction(id)));

  private origDatablocks$ = this.store.pipe(select(getCurrentOrigDatablocks));
  private datablocks$ = this.store.pipe(select(getCurrentDatablocks));
  
  private attachments$ = this.store.pipe(select(getCurrentAttachments));

  private isAdmin$ = this.store.pipe(select(getIsAdmin));
  private dataset$ = this.store.pipe(select(getCurrentDataset));

  constructor(
    private route: ActivatedRoute,
    private store: Store<any>
  ) {}

  ngOnInit() {
    const msg = new Message();
    this.subscriptions.push(
      this.store.pipe(select(selectors.jobs.submitJob)).subscribe(
        ret => {
          if (ret && Array.isArray(ret)) {
            console.log(ret);
          }
        },
        error => {
          console.log(error);
          msg.type = MessageType.Error;
          msg.content = 'Job not Submitted';
          this.store.dispatch(new ua.ShowMessageAction(msg));
        }
      )
    );

    this.subscriptions.push(
      this.store.pipe(select(selectors.jobs.getError)).subscribe(err => {
        if (err) {
          msg.type = MessageType.Error;
          msg.content = err.message;
          this.store.dispatch(new ua.ShowMessageAction(msg));
        }
      })
    );
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

  getFilesize(size: number): string {
    return filesize(size || 0);
  }

  onExportClick() {
    this.dataset$.pipe(take(1)).subscribe(ds => {

      const options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: false,
        useBom: true,
        headers: Object.keys(ds)
      };
      var newDs = {}
      for (var key in ds) {
        newDs[key] = JSON.stringify(ds[key])
      }
      const ts = new Angular5Csv([newDs], 'Dataset_' + ds.pid, options);
    });
  }

  resetDataset(dataset) {
    this.store.pipe(
      select(state => state.root.user),
      take(1))
      .subscribe(user => {
        user = user['currentUser'];
        const job = new Job();
        job.emailJobInitiator = user['email'];
        job.jobParams = {};
        job.jobParams['username'] = user['username'] || undefined;
        if (!job.emailJobInitiator) {
          job.emailJobInitiator = user['profile'] ? user['profile']['email'] : user['email'];
        }
        job.creationTime = new Date();
        job.type = 'reset';
        const fileObj = {};
        const fileList = [];
        fileObj['pid'] = dataset['pid'];
        if (dataset['datablocks']) {
          dataset['datablocks'].map(d => {
            fileList.push(d['archiveId']);
          });
        }
        fileObj['files'] = fileList;
        job.datasetList = [fileObj];
        console.log(job);
        this.store.dispatch(new ja.SubmitAction(job));
      });
  }
}
