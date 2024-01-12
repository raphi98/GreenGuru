import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncyclopediaDialogComponent } from './encyclopedia-dialog.component';

describe('EncyclopediaDialogComponent', () => {
  let component: EncyclopediaDialogComponent;
  let fixture: ComponentFixture<EncyclopediaDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EncyclopediaDialogComponent]
    });
    fixture = TestBed.createComponent(EncyclopediaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
