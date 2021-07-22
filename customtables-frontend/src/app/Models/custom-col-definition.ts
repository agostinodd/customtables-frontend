interface CustomCalculatedColumn {
  id?: string;
  expressionToCalculate: Array<any>;
  radOrDeg: string;
}

export interface CustomColDefinition {
  id?: string;
  name: string;
  colNr: number;
  datatype: string;
  calculatedCol?: CustomCalculatedColumn;
}
