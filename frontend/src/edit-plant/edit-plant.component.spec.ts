import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPlantComponent } from './edit-plant.component';

describe('EditPlantComponent', () => {
  let component: EditPlantComponent;
  let fixture: ComponentFixture<EditPlantComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditPlantComponent]
    });
    fixture = TestBed.createComponent(EditPlantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
