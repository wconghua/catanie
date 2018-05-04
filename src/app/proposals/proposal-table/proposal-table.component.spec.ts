import {NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Http} from '@angular/http';
import {ActivatedRoute, Router} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTableModule, MatDialogModule} from '@angular/material';
import {ProposalTableComponent} from './proposal-table.component';
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


describe('ProposalTableComponent', () => {
  let component: ProposalTableComponent;
  let fixture: ComponentFixture<ProposalTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatTableModule, MatDialogModule, FormsModule, ReactiveFormsModule, StoreModule.forRoot({})],
      declarations: [ProposalTableComponent]
    });
    TestBed.overrideComponent(ProposalTableComponent, {
      set: {
        providers: [
          {provide: UserApi, useClass: MockUserApi},
          {provide: Http, useClass: MockHttp},
          {provide: Router, useClass: MockRouter},
          {provide: ActivatedRoute, useClass: MockActivatedRoute},
          {provide: ConfigService, useClass: MockConfigService},
          {provide: Store, useClass: MockStore}
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

});
