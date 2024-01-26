import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncyclopediaPageComponent } from './encyclopedia-page.component';

describe('EncyclopediaPageComponent', () => {
  let component: EncyclopediaPageComponent;
  let fixture: ComponentFixture<EncyclopediaPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EncyclopediaPageComponent]
    });
    fixture = TestBed.createComponent(EncyclopediaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
