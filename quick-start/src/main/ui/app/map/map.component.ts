import { Component, ElementRef, ViewChild } from '@angular/core';
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
  private currSel: any = {};
  private connections: Array<any> = [];

  // Element references for determining coordinates
  @ViewChild('srcheading') srcheading: ElementRef;
  @ViewChild('harmheading') harmheading: ElementRef;
  @ViewChild('mapproperty') mapproperty: ElementRef;

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
          self.sampleDocSrcProps.push({
            key: key,
            val: String(val),
            type: typeof(val),
            selected: false,
            connected: false,
            hovering: false
          });
        });
      });
    },
    () => {},
    () => {});
  }

  constructor(
    private searchService: SearchService,
    private entitiesService: EntitiesService,
    private elRef: ElementRef) {
    this.getEntities();
    this.getSampleDoc();
  }

  /**
   * Update styles when mouses over property container.
   * @param {string} name     Property name
   * @param {string} proptype Property type ('src' or 'harm')
   */
  handleMouseover(name, proptype) {
    let that = this;
    let prop = this.getProperty(name, proptype);
    prop.hovering = true;
    // Update styles for any connections
    let conns = this.getConnections(name, proptype);
    if (conns.length > 0) {
      let otherType = (proptype === 'src') ? 'harm' : 'src';
      _.forEach(conns, function(conn) {
        let connProp = that.getProperty(conn[otherType], otherType);
        connProp.hovering = true;
        conn.stroke = 'rgb(191,0,0)';
      });
    }
  }

  /**
   * Update styles when cursor mouses out of property container.
   * @param {string} name     Property name
   * @param {string} proptype Property type ('src' or 'harm')
   */
  handleMouseout(name, proptype) {
    let that = this;
    let prop = this.getProperty(name, proptype);
    prop.hovering = false;
    // Update styles for any connections
    let conns = this.getConnections(name, proptype);
    if (conns.length > 0) {
      let otherType = (proptype === 'src') ? 'harm' : 'src';
      _.forEach(conns, function(conn) {
        let connProp = that.getProperty(conn[otherType], otherType);
        connProp.hovering = false;
        conn.stroke = 'rgb(180,180,180)';
      });
    }
  }

  /**
   * Update state and styles when property container is clicked.
   * @param {string} name     Property name
   * @param {string} proptype Property type ('src' or 'harm')
   */
  handleClick(name, proptype) {
    let prop = this.getProperty(name, proptype);
    // Selection
    if ((!this.currSel.src && !this.currSel.harm) ||
        (this.currSel[proptype] && (this.currSel[proptype] !== name))) {
      prop.selected = true;
      this.currSel[proptype] = name;
    }
    // Deselection
    else if (this.currSel[proptype] === name) {
      this.currSel = {};
      prop.selected = false;
    }
    // Connection
    else {
      let proptypeOther = (proptype === 'src') ? 'harm' : 'src';
      let propOther = this.getProperty(this.currSel[proptypeOther], proptypeOther);
      prop.selected = false, prop.connected = true;
      propOther.selected = false, propOther.connected = true, propOther.hovering = true;
      let srcCoord, harmCoord;
      if (proptype === 'src') {
        srcCoord = this.getPropertyCoord(name, proptype);
        harmCoord = this.getPropertyCoord(this.currSel[proptypeOther], proptypeOther);
      } else {
        srcCoord = this.getPropertyCoord(this.currSel[proptypeOther], proptypeOther);
        harmCoord = this.getPropertyCoord(name, proptype);
      }
      this.connections.push({
        src: (proptype === 'src') ? name : this.currSel[proptypeOther],
        harm: (proptype === 'harm') ? name : this.currSel[proptypeOther],
        x1: srcCoord.x,
        y1: srcCoord.y,
        x2: harmCoord.x,
        y2: harmCoord.y,
        stroke: 'rgb(191,0,0)'
      })
      this.currSel = {};
    }
  }

  /**
   * Get existing connections for a property.
   * @param {string} name     Property name
   * @param {string} proptype Property type ('src' or 'harm')
   */
  getConnections(name, proptype) {
    return _.filter(this.connections, [proptype, name]);
  }

  /**
   * Get the property object (source or harmonized) based on its name and type in the UI.
   * @param {string} name     Property name
   * @param {string} proptype Property type ('src' or 'harm')
   */
  getProperty(name, proptype) {
    if (proptype === 'src') {
      return _.find(this.sampleDocSrcProps, ['key', name]);
    } else if (proptype === 'harm') {
      return _.find(this.chosenEntity.definition.properties, ['name', name]);
    }
  }

  /**
   * Get the coordinate point for making a connection to a property.
   * Middle right of source property container.
   * Middle left of harmonized porperty container.
   * @param {string} name     Property name
   * @param {string} proptype Property type ('src' or 'harm')
   */
  getPropertyCoord(name, proptype) {
    // TODO get all coord info from elements and CSS (no hard coding)
    let srcheadingCSS = window.getComputedStyle(this.srcheading.nativeElement);
    let index = 0, coord = {};
    let headingHeight = this.srcheading.nativeElement.offsetHeight;
    if (proptype === 'src') {
      index = _.findIndex(this.sampleDocSrcProps, ['key', name]);
      return {
        x: 300,
        y: headingHeight + 27 + (index * 44)
      };
    } else if (proptype === 'harm') {
      index = _.findIndex(this.chosenEntity.definition.properties, ['name', name]);
      return {
        x: 600,
        y: headingHeight + 27 + (index * 44)
      };
    }
  }

}
