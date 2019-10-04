import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ViewChild, ViewChildren, QueryList, ViewEncapsulation } from '@angular/core';
import { Entity } from '../../../../../models/index';
import { Mapping } from "../../../../mappings/mapping.model";
import { EntityTableUiComponent } from './entity-table-ui.component';

import {MatDialog, MatPaginator, MatSort, MatTable, MatTableDataSource} from "@angular/material";

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-entity-table-ui',
  templateUrl: './entity-table-ui.component.html',
  styleUrls: ['./entity-table-ui.component.scss'],
  encapsulation: ViewEncapsulation.None,
  
})
export class EntityTableUiComponent implements OnChanges {

  @Input() entityProps: any;
  @Input() showHeader: boolean;
  @Input() nestedLevel: number;
  @Input() srcProps: any;
  @Input() functionLst: object;
  
  dataSource: MatTableDataSource<any>;

  columnsToDisplay = ['name', 'datatype', 'expression', 'value'];

  @ViewChild(MatTable)
  table: MatTable<any>;

  @ViewChildren('fieldName') fieldName:QueryList<any>;

  mapExpressions = {};
  showProp = {};
  initShow = false;

  ngOnInit(){
    console.log('ngOnInit');
    // if (!this.dataSource && this.entityNested){
    //   this.dataSource = new MatTableDataSource<any>(this.entityNested.definitions['OrderType'].properties);
    // }
  }

  constructor(

  ) {}

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngOnChanges', changes);
    if (changes.entityProps && changes.entityProps.currentValue){
      this.dataSource = new MatTableDataSource<any>(changes.entityProps.currentValue);
    }
  }

  clicked(name) {
    console.log('clicked', name);
  }

  getDatatype(prop) {
    if (prop.datatype === 'array') {
      let s = prop.items.$ref.split('/');
      return s.slice(-1).pop() + '[]';
    } else if (prop.$ref !== null) {
      let s = prop.$ref.split('/');
      return s.slice(-1).pop();
    } else {
      return prop.datatype;
    }
  }

  isNested(prop) {
    return prop.datatype === 'array' || prop.$ref !== null;
  }

  handleSelection(name, expr): void {
    console.log('handleSelection', name, expr);
  }

  toggleProp(name) {
    if(typeof this.showProp[name] === 'undefined') {
      this.showProp[name] = !this.initShow;
    } else {
      this.showProp[name] = !this.showProp[name];
    }
  }

  counter(i: number) {
      return new Array(i);
  }

  executeFunctions(funcName, propName) {
    this.mapExpressions[propName] = this.mapExpressions[propName] + " " + this.functionsDef(funcName);
    console.log(funcName, propName, this.mapExpressions[propName])
  }

  functionsDef(funcName) {
    return this.functionLst[funcName].signature
  }

  // OpenFullSourceQuery() {
  //   let result = this.dialogService.alert(
  //     this.step.options.sourceQuery,
  //     'OK'
  //   );
  //   result.subscribe();
  // }

  insertFunction(fname, index) {

    var startPos = this.fieldName.toArray()[index].nativeElement.selectionStart;
    this.fieldName.toArray()[index].nativeElement.focus();
    this.fieldName.toArray()[index].nativeElement.value = this.fieldName.toArray()[index].nativeElement.value.substr(0, this.fieldName.toArray()[index].nativeElement.selectionStart) + this.functionsDef(fname) + this.fieldName.toArray()[index].nativeElement.value.substr(this.fieldName.toArray()[index].nativeElement.selectionStart, this.fieldName.toArray()[index].nativeElement.value.length);

    this.fieldName.toArray()[index].nativeElement.selectionStart = startPos;
    this.fieldName.toArray()[index].nativeElement.selectionEnd = startPos + this.functionsDef(fname).length;
    this.fieldName.toArray()[index].nativeElement.focus();
  }

  insertField(fname, index) {

    var startPos = this.fieldName.toArray()[index].nativeElement.selectionStart;
    this.fieldName.toArray()[index].nativeElement.focus();
    this.fieldName.toArray()[index].nativeElement.value = this.fieldName.toArray()[index].nativeElement.value.substr(0, this.fieldName.toArray()[index].nativeElement.selectionStart) + fname + this.fieldName.toArray()[index].nativeElement.value.substr(this.fieldName.toArray()[index].nativeElement.selectionStart, this.fieldName.toArray()[index].nativeElement.value.length);

    this.fieldName.toArray()[index].nativeElement.selectionStart = startPos;
    this.fieldName.toArray()[index].nativeElement.selectionEnd = startPos + fname.length;
    this.fieldName.toArray()[index].nativeElement.focus();
  }

}
