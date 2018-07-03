import {NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Http} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTableModule, MatDialogModule} from '@angular/material';
import {ProposalTablePureComponent} from './proposal-table-pure.component';
import {Store, StoreModule} from '@ngrx/store';
import {ConfigService} from 'shared/services/config.service';
import {
  MockActivatedRoute,
  MockConfigService,
  MockHttp,
  MockRouter,
  MockStore,
  MockUserApi
} from 'shared/MockStubs';
import {UserApi} from 'shared/sdk/services';
import {TruncateModule} from "ng2-truncate";


describe('ProposalTableComponent', () => {
  let component: ProposalTablePureComponent;
  let fixture: ComponentFixture<ProposalTablePureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatTableModule, FormsModule, ReactiveFormsModule, TruncateModule],
      declarations: [ProposalTablePureComponent]
    });
    TestBed.overrideComponent(ProposalTablePureComponent, {
      set: {
        providers: [
          {provide: ConfigService, useClass: MockConfigService},
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalTablePureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should contain a material table', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.dataset-table')).toBeTruthy();
  });

  it('should contain 2 paginators', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll('.dataset-paginator').length).toBe(2);
  });
});
