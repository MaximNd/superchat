import { Component, OnInit, Input } from '@angular/core';
import { IContact } from 'shared';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.css']
})
export class ContactInfoComponent implements OnInit {
  @Input()
  contact: IContact;

  constructor() {}

  ngOnInit() {}
}
