import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedChatComponent } from './selected-chat.component';

describe('SelectedChatComponent', () => {
  let component: SelectedChatComponent;
  let fixture: ComponentFixture<SelectedChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectedChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
