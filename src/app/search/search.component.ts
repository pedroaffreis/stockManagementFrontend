import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit{
  
  
  constructor(){}

  ngOnInit(): void {
    
  }
  @Input()
  enteredSearchValue:string = '';
  @Input()
  placeholder: string = 'Search...';

  @Output()
  searchTextChanged:EventEmitter<string> = new EventEmitter<string>();

onSearchTextChanged(){
  this.searchTextChanged.emit(this.enteredSearchValue);

}

}
