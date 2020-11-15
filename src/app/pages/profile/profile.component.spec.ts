import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HighlightModule } from 'ngx-highlightjs';
import { hljsLanguages } from 'src/app/app.module';

import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [
        HighlightModule.forRoot({
          languages: hljsLanguages
        })
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
