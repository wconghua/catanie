import { APP_CONFIG, AppConfig } from "app-config.module";
import { MatTableDataSource, MatPaginator } from "@angular/material";
import { Observable } from "rxjs";
import { OrigDatablock, Dataset } from "shared/sdk/models";
import { Store, select } from "@ngrx/store";
import { getIsAdmin } from "state-management/selectors/users.selectors";
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
  Inject
} from "@angular/core";
import { getCurrentDataset } from "state-management/selectors/datasets.selectors";
import { first } from "rxjs/operators";

@Component({
  selector: "datafiles",
  templateUrl: "./datafiles.component.html",
  styleUrls: ["./datafiles.component.css"]
})
export class DatafilesComponent implements OnInit, AfterViewInit {
  @Input()
  dataBlocks: Array<OrigDatablock>;

  urlPrefix: string;
  count: number = 0;
  files: Array<JSON> = [];
  selectedDF;
  dsId: string;
  dataFiles: Array<any> = [];

  areAllSelected: boolean = false;
  isNoneSelected: boolean = true;

  multipleDownloadEnabled: boolean = this.appConfig.multipleDownloadEnabled;
  multipleDownloadAction: string = this.appConfig.multipleDownloadAction;

  displayedColumns = (this.appConfig.multipleDownloadEnabled
    ? ["select"]
    : []
  ).concat(["name", "size", "path"]);

  dataSource: MatTableDataSource<any> | null;
  @ViewChild(MatPaginator)
  paginator: MatPaginator;

  admin$: Observable<boolean>;
  dataset$: Observable<Dataset>;

  constructor(
    private store: Store<any>,
    @Inject(APP_CONFIG) private appConfig: AppConfig
  ) {
    this.urlPrefix = appConfig.fileserverBaseURL;
  }

  ngOnInit() {
    this.admin$ = this.store.pipe(select(getIsAdmin));
    this.dataset$ = this.store.pipe(select(getCurrentDataset));

    if (this.dataBlocks) {
      this.getDatafiles(this.dataBlocks);
    }
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
    }
    // this.dataSource.sort = this.sort;
  }

  /**
   * Load datafiles and add to source for table viewing
   * @param datablocks
   */
  getDatafiles(datablocks: Array<OrigDatablock>) {
    datablocks.forEach(block => {
      const files = block.dataFileList;
      const selectable = files.map(file => {
        return { ...file, selected: false };
      });
      this.files = this.files.concat(selectable);
    });

    this.count = this.files.length;
    this.dataSource = new MatTableDataSource(this.files);
  }

  getAreAllSelected() {
    return this.dataSource.data.reduce(
      (accum, curr) => accum && curr.selected,
      true
    );
  }

  getIsNoneSelected() {
    return this.dataSource.data.reduce(
      (accum, curr) => accum && !curr.selected,
      true
    );
  }

  getSelectedFiles() {
    return this.dataSource.data
      .filter(file => file.selected)
      .map(file => file.path);
  }

  updateSelectionStatus() {
    this.areAllSelected = this.getAreAllSelected();
    this.isNoneSelected = this.getIsNoneSelected();
  }

  onSelect(event, file) {
    file.selected = event.checked;
    this.updateSelectionStatus();
  }

  onSelectAll(event) {
    for (const file of this.dataSource.data) {
      file.selected = event.checked;
    }
    this.updateSelectionStatus();
  }

  onDownload() {
    this.dataset$.pipe(first()).subscribe(dataset => {
      const base = dataset.sourceFolder;
      const selected = this.dataSource.data.filter(file => file.selected);
      alert(selected.map(file => base + "/" + file.path).join("\n"));
    });
  }
}
