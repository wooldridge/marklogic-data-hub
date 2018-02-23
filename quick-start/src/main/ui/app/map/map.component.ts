import { Component } from '@angular/core';
import { Entity } from '../entities';
import { EntitiesService } from '../entities/entities.service';
import { SearchService } from '../search/search.service';

import * as _ from 'lodash';

@Component({
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  // Harmonized Model
  public entities: Array<Entity>;
  public chosenEntity: Entity;
  private entityPrimaryKey: string = '';

  // Source Document
  private currentDatabase: string = 'data-hub-STAGING';
  private entitiesOnly: boolean = false;
  private searchText: string = null;
  private activeFacets: any = {};
  private currentPage: number = 1;
  private pageLength: number = 1; // pulling single record
  private sampleDoc: any = null;
  private sampleDocSrc: any = null;
  private sampleDocSrcProps: Array<any> = [];
  private valMaxLen: number = 15;

  // Connections
  private conns: Array<any> = [];

  /**
   * Get entities and choose one to serve as harmonized model.
   */
  getEntities(): void {
    this.entitiesService.entitiesChange.subscribe(entities => {
      this.entities = entities;
      this.chosenEntity = this.entities[0]; // currently just taking the first entity defined. Will add choice via UI later
      this.entityPrimaryKey = this.chosenEntity.definition.primaryKey;
    });
    this.entitiesService.getEntities();
  }

  /**
   * Get sample documents and choose one to serve as source.
   */
  getSampleDoc(): void {
    let self = this;
    this.searchService.getResults(
      this.currentDatabase,
      this.entitiesOnly,
      this.searchText,
      this.activeFacets,
      this.currentPage,
      this.pageLength
    ).subscribe(response => {
      this.sampleDoc = response.results[0];
      // get contents of the document
      this.searchService.getDoc(this.currentDatabase, this.sampleDoc.uri).subscribe(doc => {
        this.sampleDocSrc = doc;
        _.forEach(this.sampleDocSrc, function(val, key) {
          let prop = {
            key: key,
            val: String(val),
            type: typeof(val)
          };
          self.sampleDocSrcProps.push(prop);
          // Set up connections (all empty initially)
          self.conns.push({
            src: prop,
            harm: null
          });
        });
      });
    },
    () => {},
    () => {});
  }

  constructor(
    private searchService: SearchService,
    private entitiesService: EntitiesService) {
    this.getEntities();
    this.getSampleDoc();
  }

  handleSelection(prop, proptype, index): void {
    let conn = this.conns[index];
    if (prop === null) {
      conn[proptype] = null;
    } else {
      conn[proptype] = {
        key: prop.name,
        type: prop.datatype
      };
    }
  }

}
