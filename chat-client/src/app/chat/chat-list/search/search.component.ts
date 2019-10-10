import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @Output()
  inputSearch = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  searchInputHandler(value: string) {
    this.inputSearch.emit(value);
  }
}
