import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayComponent } from './play.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        PlayComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(PlayComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'wwtbam'`, () => {
    const fixture = TestBed.createComponent(PlayComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('wwtbam');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(PlayComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain('wwtbam app is running!');
  });
});
