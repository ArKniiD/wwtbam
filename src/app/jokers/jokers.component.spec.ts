import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JokersComponent } from './jokers.component';

describe('JokersComponent', () => {
  let component: JokersComponent;
  let fixture: ComponentFixture<JokersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JokersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JokersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
