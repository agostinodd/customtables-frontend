import {CustomColDefinition} from './custom-col-definition';

export interface CustomSchema {
  id?: string;
  customColDefinitionSet: Array<CustomColDefinition>;
}
