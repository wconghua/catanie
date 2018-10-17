import { APP_CONFIG, AppConfig } from "app-config.module";
import { ArchivingService } from "../archiving.service";
import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { Dataset, MessageType, ViewMode } from "state-management/models";
import { DialogComponent } from "shared/modules/dialog/dialog.component";
import { MatCheckboxChange, MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { ShowMessageAction } from "state-management/actions/user.actions";
import { combineLatest, Subscription } from "rxjs";
import { getCurrentEmail } from "../../state-management/selectors/users.selectors";
import { getError, submitJob } from "state-management/selectors/jobs.selectors";
import { select, Store } from "@ngrx/store";


import { faCertificate } from "@fortawesome/free-solid-svg-icons/faCertificate";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons/faCalendarAlt";
import { faCoins } from "@fortawesome/free-solid-svg-icons/faCoins";
import { faDownload } from "@fortawesome/free-solid-svg-icons/faDownload";
import { faFileAlt } from "@fortawesome/free-solid-svg-icons/faFileAlt";
import { faFolder } from "@fortawesome/free-solid-svg-icons/faFolder";
import { faUpload } from "@fortawesome/free-solid-svg-icons/faUpload";
import { faIdBadge } from "@fortawesome/free-solid-svg-icons/faIdBadge";
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers";

import {
  AddToBatchAction,
  ChangePageAction,
  ClearSelectionAction,
  DeselectDatasetAction,
  ExportToCsvAction,
  SelectAllDatasetsAction,
  SelectDatasetAction,
  SetViewModeAction,
  SortByColumnAction
} from "state-management/actions/datasets.actions";

import {
  getDatasets,
  getDatasetsInBatch,
  getDatasetsPerPage,
  getFilters,
  getIsEmptySelection,
  getIsLoading,
  getPage,
  getSelectedDatasets,
  getTotalSets,
  getViewMode
} from "state-management/selectors/datasets.selectors";

export interface PageChangeEvent {
  pageIndex: number;
  pageSize: number;
  length: number;
}

export interface SortChangeEvent {
  active: keyof Dataset;
  direction: "asc" | "desc" | "";
}

@Component({
  selector: "dataset-table",
  templateUrl: "dataset-table.component.html",
  styleUrls: ["dataset-table.component.scss"]
})
export class DatasetTableComponent implements OnInit, OnDestroy {
  faIdBadge = faIdBadge;
  faFolder = faFolder;
  faCoins = faCoins;
  faCalendarAlt = faCalendarAlt;
  faFileAlt = faFileAlt;
  faCertificate = faCertificate;
  faUsers = faUsers;
  faUpload = faUpload;
  faDownload = faDownload;
  datasets$ = this.store.pipe(select(getDatasets));
  currentPage$ = this.store.pipe(select(getPage));
  datasetsPerPage$ = this.store.pipe(select(getDatasetsPerPage));
  datasetCount$ = this.store.pipe(select(getTotalSets));
  loading$ = this.store.pipe(select(getIsLoading));
  // These should be made part of the NgRX state management
  public currentMode: string;
  private selectedSets$ = this.store.pipe(select(getSelectedDatasets));
  private batch$ = this.store.pipe(select(getDatasetsInBatch));
  private mode$ = this.store.pipe(select(getViewMode));
  private isEmptySelection$ = this.store.pipe(select(getIsEmptySelection));
  private filters$ = this.store.pipe(select(getFilters));
  private email$ = this.store.pipe(select(getCurrentEmail));
  private allAreSeleted$ = combineLatest(
    this.datasets$,
    this.selectedSets$,
    (datasets, selected) => {
      const pids = selected.map(set => set.pid);
      return (
        datasets.length &&
        datasets.find(dataset => pids.indexOf(dataset.pid) === -1) == null
      );
    }
  );
  private selectedPids: string[] = [];
  private selectedPidsSubscription = this.selectedSets$.subscribe(datasets => {
    this.selectedPids = datasets.map(dataset => dataset.pid);
  });
  private inBatchPids: string[] = [];
  private inBatchPidsSubscription = this.batch$.subscribe(datasets => {
    this.inBatchPids = datasets.map(dataset => dataset.pid);
  });
  private modes = ["view", "archive", "retrieve"];
  // compatibility analogs of observables
  private selectedSets: Dataset[] = [];
  private selectedSetsSubscription = this.selectedSets$.subscribe(
    selectedSets => (this.selectedSets = selectedSets)
  );
  private modeSubscription = this.mode$.subscribe((mode: ViewMode) => {
    this.currentMode = mode;
  });
  // and eventually be removed.
  private submitJobSubscription: Subscription;
  private jobErrorSubscription: Subscription;
  private readonly defaultColumns: string[] = [
    "select",
    "pid",
    "sourceFolder",
    "size",
    "creationTime",
    "type",
    "proposalId",
    "ownerGroup",
    "archiveStatus",
    "retrieveStatus",
    "preview"
  ];
  visibleColumns = this.defaultColumns.filter(
    column => this.appConfig.disabledDatasetColumns.indexOf(column) === -1
  );

  constructor(
    private router: Router,
    private store: Store<any>,
    private archivingSrv: ArchivingService,
    public dialog: MatDialog,
    @Inject(APP_CONFIG) public appConfig: AppConfig
  ) {
  }

  ngOnInit() {
    this.submitJobSubscription = this.store.pipe(select(submitJob)).subscribe(
      ret => {
        if (ret && Array.isArray(ret)) {
          console.log(ret);
          this.store.dispatch(new ClearSelectionAction());
        }
      },
      error => {
        this.store.dispatch(
          new ShowMessageAction({
            type: MessageType.Error,
            content: "Job not Submitted"
          })
        );
      }
    );

    this.jobErrorSubscription = this.store
      .pipe(select(getError))
      .subscribe(err => {
        if (err) {
          this.store.dispatch(
            new ShowMessageAction({
              type: MessageType.Error,
              content: err.message
            })
          );
        }
      });
  }

  ngOnDestroy() {
    this.modeSubscription.unsubscribe();
    this.selectedSetsSubscription.unsubscribe();
    this.submitJobSubscription.unsubscribe();
    this.jobErrorSubscription.unsubscribe();
    this.selectedPidsSubscription.unsubscribe();
  }

  onExportClick(): void {
    this.store.dispatch(new ExportToCsvAction());
  }

  /**
   * Handle changing of view mode and disabling selected rows
   * @param event
   * @param mode
   */
  onModeChange(event, mode: ViewMode): void {
    this.store.dispatch(new SetViewModeAction(mode));
  }

  /**
   * Sends archive command for selected datasets (default includes all
   * datablocks for now) to Dacat API
   * @param {any} event - click handler (not currently used)
   * @memberof DashboardComponent
   */
  archiveClickHandle(event): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "auto",
      data: { title: "Really archive?", question: "" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.archivingSrv.archive(this.selectedSets).subscribe(
          () => this.store.dispatch(new ClearSelectionAction()),
          err =>
            this.store.dispatch(
              new ShowMessageAction({
                type: MessageType.Error,
                content: err.message
              })
            )
        );
      }
      // this.onClose.emit(result);
    });
  }

  /**
   * Sends retrieve command for selected datasets
   * @param {any} event - click handler (not currently used)
   * @memberof DashboardComponent
   */
  retrieveClickHandle(event): void {
    const destPath = "/archive/retrieve";
    const dialogRef = this.dialog.open(DialogComponent, {
      width: "auto",
      data: {
        title: "Really retrieve?",
        question: "",
        input: "Destination: " + destPath
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.archivingSrv.retrieve(this.selectedSets, destPath).subscribe(
          () => this.store.dispatch(new ClearSelectionAction()),
          err =>
            this.store.dispatch(
              new ShowMessageAction({
                type: MessageType.Error,
                content: err.message
              })
            )
        );
      }
    });
  }

  onClick(dataset: Dataset): void {
    const pid = encodeURIComponent(dataset.pid);
    this.router.navigateByUrl("/datasets/" + pid);
  }

  isSelected(dataset: Dataset): boolean {
    return this.selectedPids.indexOf(dataset.pid) !== -1;
  }

  isInBatch(dataset: Dataset): boolean {
    return this.inBatchPids.indexOf(dataset.pid) !== -1;
  }

  onSelect(event: MatCheckboxChange, dataset: Dataset): void {
    if (event.checked) {
      this.store.dispatch(new SelectDatasetAction(dataset));
    } else {
      this.store.dispatch(new DeselectDatasetAction(dataset));
    }
  }

  onSelectAll(event: MatCheckboxChange) {
    if (event.checked) {
      this.store.dispatch(new SelectAllDatasetsAction());
    } else {
      this.store.dispatch(new ClearSelectionAction());
    }
  }

  onPageChange(event: PageChangeEvent): void {
    this.store.dispatch(new ChangePageAction(event.pageIndex, event.pageSize));
  }

  onSortChange(event: SortChangeEvent): void {
    const { active: column, direction } = event;
    this.store.dispatch(new SortByColumnAction(column, direction));
  }

  onAddToBatch(): void {
    this.store.dispatch(new AddToBatchAction());
    this.store.dispatch(new ClearSelectionAction());
  }
}
