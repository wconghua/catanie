import {Component, Input, OnInit} from '@angular/core';
import {Datablock} from 'shared/sdk/models';
import {ActivatedRoute,Router} from '@angular/router';
import {MatTableDataSource} from '@angular/material';


@Component({
  selector: 'datablocks-table',
  templateUrl: './datablocks-table.component.html',
  styleUrls: ['./datablocks-table.component.css']
})
export class DatablocksComponent implements OnInit {

  @Input() datablocks: Array<Datablock>;
  @Input() title = 'Datablocks';

  blockSource: MatTableDataSource<any> | null;

  displayedColumns = ['id', 'size', 'files'];

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    console.log(this.datablocks);
    this.blockSource = new MatTableDataSource(this.datablocks);
  }

  onSelect(event) {
    console.log(event);
  }

}

