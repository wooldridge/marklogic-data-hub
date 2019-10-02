import { Matching } from '../edit-flow/mastering/matching/matching.model';
import { Merging } from '../edit-flow/mastering/merging/merging.model';
import { StepType } from './step.model';

export class MasteringOptions {
  public additionalCollections: string[] = [];
  public collections: string[] = [];
  public sourceQuery: string = '';
  public sourceCollection: string = '';
  public sourceDatabase: string = '';
  public targetDatabase: string;
  public outputFormat: string;
  public matchOptions: Matching;
  public mergeOptions: Merging;
  constructor(type) {
    if (type === StepType.MASTERING || type === StepType.MATCHING) {
      this.matchOptions = new Matching;
    }
    if (type === StepType.MASTERING || type === StepType.MERGING) {
      this.mergeOptions = new Merging;
    }
  }
}
