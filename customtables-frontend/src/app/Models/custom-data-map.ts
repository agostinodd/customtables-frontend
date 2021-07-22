import {CustomColDefinition} from './custom-col-definition';
import {CustomCol} from './custom-col';

export interface CustomDataMap {
  id?: string;
  customColDefinition: CustomColDefinition;
  customCol: CustomCol;
}
