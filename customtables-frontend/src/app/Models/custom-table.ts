import {CustomSchema} from './custom-schema';
import {CustomRow} from './custom-row';

export interface CustomTable {
  id?: string;
  customSchema: CustomSchema;
  ownerMail: string;
  customData: Array<CustomRow>;
}
