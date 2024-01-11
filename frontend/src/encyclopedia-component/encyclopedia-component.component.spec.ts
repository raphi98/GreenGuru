import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncyclopediaComponentComponent } from './encyclopedia-component.component';

describe('EncyclopediaComponentComponent', () => {
  let component: EncyclopediaComponentComponent;
  let fixture: ComponentFixture<EncyclopediaComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EncyclopediaComponentComponent]
    });
    fixture = TestBed.createComponent(EncyclopediaComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
