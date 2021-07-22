import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomTable} from '../../Models/custom-table';
import {CustomColDefinition} from '../../Models/custom-col-definition';
import {Form, FormControl, FormGroup, Validators} from '@angular/forms';
import {evaluate} from 'mathjs';
import {tryCatch} from 'rxjs/internal-compatibility';
import {CustomDataMap} from '../../Models/custom-data-map';
import {CustomTableService} from '../../services/custom-table.service';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements OnInit {

  @Input() calculatorOpener;
  @Output() calculatorOpenerChange = new EventEmitter();


  @Input() customTable: CustomTable;
  @Output() customTableChange = new EventEmitter();

  radOrDegGroup: FormGroup;
  radOrDegSwitch: FormControl;

  // Gradmaß
  DEGREE = 'DEG';
  // Bogenmaß
  RAD = 'RAD';
  currentCalcMode = this.DEGREE;

  expression = [];
  expressionString: string;
  expressionTestString: string;
  calcColGrup: FormGroup;
  calcColName: FormControl;

  constructor(private customTableService: CustomTableService) { }

  ngOnInit() {

    this.calcColName = new FormControl('', [Validators.required, Validators.maxLength(20)]);
    this.calcColGrup = new FormGroup({
      calcColName: this.calcColName
    });

  }

  submitMathCol() {

  }

  getAllNumberCols(): CustomColDefinition[] {
    return this.customTable.customSchema.customColDefinitionSet.filter((col) => col.datatype.toLowerCase() === 'number');
  }

  /*
  TODO IMPLEMENT
  changeCalcMode() {
    console.log(this.radOrDegSwitch.value);
    if (this.currentCalcMode === this.DEGREE) {
      this.currentCalcMode = this.RAD;
    } else {
      this.currentCalcMode = this.DEGREE;
    }
  }
  */

  addCol(cols: CustomColDefinition) {
    this.expression.push(cols);
    this.toMathExpressionString();
  }

  addNum(n: number) {
    this.expression.push(n.toString());
    this.toMathExpressionString();
  }

  addLit(s: string) {
    this.expression.push(s);
    this.toMathExpressionString();
  }

  isCustomColDefinition(object: string| CustomColDefinition): object is CustomColDefinition {
    return (object as CustomColDefinition).id !== undefined;
  }

  toMathExpressionString(): string {
    let exp = '';
    let testExp = ';';
    this.expression.forEach((x) => {
      if (this.isCustomColDefinition(x)) {
        exp += x.name;
        testExp += '1';
      } else {
        exp += x.toString();
        testExp += x.toString();
      }
    });
    this.expressionString = exp;
    this.expressionTestString = testExp;
    return exp;
  }

  async submitExpression(): Promise<boolean> {
    if (this.calcColGrup.valid) {
      try {
        evaluate(this.expressionTestString);
        this.calculatorOpenerChange.emit(false);
        const calculatedCol: CustomColDefinition = {
          datatype: 'Calculated',
          name: this.calcColName.value,
          colNr: this.customTable.customSchema.customColDefinitionSet.length,
          calculatedCol: {
            expressionToCalculate: this.expression,
            radOrDeg: ''
          }
        };

        this.customTable.customSchema.customColDefinitionSet.push(calculatedCol);
        await this.customTable.customData.forEach((row) => {
          const customMap: CustomDataMap = {
            customColDefinition: calculatedCol,
            customCol: {
              data: 0
            }
          };
          row.customDataMap.push(customMap);
        });
        this.customTableChange.emit(this.customTable);
        this.customTableService.saveCustomTable(this.customTable).then((result) => {
          if (result.status === 200) {
            alert('Die Berechnungsspalte wurde erfolgreich abgespeichert!');
            window.location.reload();
          } else {
            alert('Etwas ist schiefgegangen! Probieren Sie es später erneut!');
          }
        });
        return true;
      } catch (e) {
        alert('Etwas stimmt mit Ihrer Eingabe nicht! Überprüfen Sie die Syntax!');
        console.log(e);
        return false;
      }
    } else {
      alert('Bitte geben Sie einen Spaltennamen an!');
      return false;
    }


  }

  removeThisExp(x: number) {
    this.expression.splice(x, 1);
    this.toMathExpressionString();
  }
}
