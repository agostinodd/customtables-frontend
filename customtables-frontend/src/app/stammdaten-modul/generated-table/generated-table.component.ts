import {Component, OnInit, ViewChild} from '@angular/core';
import {CustomTable} from '../../Models/custom-table';
import {CustomRow} from '../../Models/custom-row';
import {CustomTableService} from '../../services/custom-table.service';
import {CustomSchema} from '../../Models/custom-schema';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CustomDataMap} from '../../Models/custom-data-map';
import {CustomColDefinition} from '../../Models/custom-col-definition';
import {evaluate} from 'mathjs';
import {ClrDatagrid, ClrDatagridComparatorInterface, ClrWizard} from '@clr/angular';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {environment} from '../../../environments/environment';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-generated-table',
  templateUrl: './generated-table.component.html',
  styleUrls: ['./generated-table.component.scss']
})
export class GeneratedTableComponent implements OnInit {


  public customTable: CustomTable;

  // STAMMDATEN SPALTEN
  public customSchema: CustomSchema;

  // DATEN!!
  public customDataFiltered: CustomRow[];

  addDataFormGroup: FormGroup;

  // NEW DATA FORMCONTROLS
  formControls: FormControl[] = [];
  // EDIT DATA FORMCONTROLS!!
  editFormGroup: FormGroup;
  editFormControls: FormControl[] = [];

  // SEARCH DATA FORMCONTROLS!!
  searchFormGroup: FormGroup;
  searchFormControls: FormControl[] = [];

  showEditData = false;
  dataToEdit: CustomRow;
  searchExpanded = false;
  showDeleteModal = false;
  calculatorGeneratorOpener = false;


  @ViewChild('tableExport', {static: false}) tableExport: ClrDatagrid;

  getMail() {
    const mailString = environment.testEmail;
    return mailString;
  }

  constructor(private customTableService: CustomTableService, private router: Router) {

  }

  loading: boolean;
  ngOnInit() {
    this.loading = true;
    this.customTableService.getCustomTable(this.getMail()).then((result) => {
      this.customTable = result;
      console.log(this.customTable);

      this.customSchema = this.customTable.customSchema;
      if(this.customTable.customData == undefined) {
        this.customTable.customData = [];
      } 

      this.addDataFormGroup = new FormGroup({});
      this.editFormGroup = new FormGroup({});
      this.customSchema.customColDefinitionSet.forEach((colDefinition) => {
        let formControl;
        let editFormControl;

        switch (colDefinition.datatype.toLowerCase()) {
          case 'calculated': {
            break;
          }
          case 'longtext': {
            formControl = new FormControl('', [Validators.maxLength(250)]);
            editFormControl = new FormControl('', [Validators.maxLength(250)]);


            this.formControls.push(formControl);
            this.editFormControls.push(formControl);
            this.addDataFormGroup.registerControl(colDefinition.id, formControl);
            this.editFormGroup.registerControl(colDefinition.id, editFormControl);
            break;
          }
          case 'text': {
            formControl = new FormControl('', [Validators.maxLength(20)]);
            editFormControl = new FormControl('', [Validators.maxLength(20)]);



            this.formControls.push(formControl);
            this.editFormControls.push(formControl);
            this.addDataFormGroup.registerControl(colDefinition.id, formControl);
            this.editFormGroup.registerControl(colDefinition.id, editFormControl);
            break;
          }
          case 'email': {
            formControl = new FormControl('', [Validators.maxLength(40), Validators.email]);
            editFormControl = new FormControl('', [Validators.maxLength(40), Validators.email]);



            this.formControls.push(formControl);
            this.editFormControls.push(formControl);
            this.addDataFormGroup.registerControl(colDefinition.id, formControl);
            this.editFormGroup.registerControl(colDefinition.id, editFormControl);
            break;
          }
          default: {
            formControl = new FormControl();
            editFormControl = new FormControl();



            this.formControls.push(formControl);
            this.editFormControls.push(formControl);
            this.addDataFormGroup.registerControl(colDefinition.id, formControl);
            this.editFormGroup.registerControl(colDefinition.id, editFormControl);
            break;
          }
        }
      });

      /*
      BUILD UP SEARCH FORMULAR
       */
      this.searchFormGroup = new FormGroup({});
      this.customSchema.customColDefinitionSet.forEach((colDef) => {
        if (colDef.datatype.toLowerCase() === 'date' || colDef.datatype.toLowerCase() === 'time') {
          const vonFormControlDate = new FormControl('');
          const bisFormControlDate = new FormControl('');
          this.searchFormGroup.registerControl(colDef.id + ';from', vonFormControlDate);
          this.searchFormGroup.registerControl(colDef.id + ';to', bisFormControlDate);
        } else {
          const formControl = new FormControl('');
          this.searchFormGroup.registerControl(colDef.id, formControl);
        }
      });

      this.customDataFiltered = [];
      this.customTable.customData.forEach((row) => this.customDataFiltered.push(row));


      console.log(this.searchFormGroup);
    }).finally(() => this.loading = false);

    console.log(this.searchFormGroup);
    console.log('oninit');
  }

  onDelete(data: CustomRow) {
    const index = this.customDataFiltered.indexOf(data);
    this.customDataFiltered.splice(index, 1);

    const datas = this.customTable.customData.find((row) => row.id === data.id);
    const finalIndex = this.customTable.customData.indexOf(datas);
    this.customTable.customData.splice(finalIndex, 1);
  }

  getInputType(datatype: string): string {
    if (datatype.toLowerCase() === 'text' || datatype.toLowerCase() === 'internet' || datatype.toLowerCase() === 'email') {
      return 'text';
    } else if (datatype.toLowerCase() === 'number') {
      return 'number';
    } else if (datatype.toLowerCase() === 'date') {
      return 'date';
    } else if (datatype.toLowerCase() === 'longtext') {
      return 'longtext';
    } else if (datatype.toLowerCase() === 'time') {
      return 'time';
    } else if (datatype.toLowerCase() === 'calculated') {
      return 'calculated';
    }
  }

  saveNewData() {
    if (this.addDataFormGroup.valid) {

      const data: CustomRow = {
        customDataMap: []
      };

      this.customSchema.customColDefinitionSet.forEach((col) => {
        if (col.datatype.toLowerCase() !== 'calculated') {
          const fc = this.addDataFormGroup.controls[col.id];
          data.customDataMap.push({customColDefinition: col, customCol: {data: fc.value}});
        } else if (col.datatype.toLowerCase() === 'calculated') {
          data.customDataMap.push({customCol: {data: null}, customColDefinition: col});
        }
      });

      this.customTable.customData.push(data);
      this.customDataFiltered.push(data);
    }
  }

  saveTableData() {
    this.customTableService.saveCustomTable(this.customTable).then((result) => {
      if (result.status === 200) {
        alert('Tabele saved!');
        window.location.reload();
      } else {
        alert('Something went wrong!');
      }
    });
  }

  onEdit(data: CustomRow) {
    this.showEditData = true;
    this.dataToEdit = data;
    this.editFormControls.forEach((fc) => {
      this.dataToEdit.customDataMap.forEach((row) => {
        this.editFormGroup.controls[row.customColDefinition.id].setValue(row.customCol.data);
      });
    });
  }

  closeEditData() {
    this.showEditData = false;
    this.dataToEdit = null;
  }

  async saveEditData() {
    await this.dataToEdit.customDataMap.filter((row) => row.customColDefinition.datatype.toLowerCase() !== 'calculated' ).forEach((row) => {
      const fc = this.editFormGroup.controls[row.customColDefinition.id];
      console.log(fc);
      row.customCol.data = fc.value;
    });
    this.customTable.customData.find((data) => data.id === this.dataToEdit.id).customDataMap = this.dataToEdit.customDataMap;

    console.log(this.customTable.customData);
    this.closeEditData();
  }

  /**
   *
   * @param id of the column definition
   */
  async search(id: string) {
    this.customDataFiltered = await this.customTable.customData.filter((row) => {
      let searchedRow = false;
      row.customDataMap.filter((col) => {
        return col.customColDefinition.id === id && col.customCol.data != null;
      }).forEach((col) => {
        if (col.customCol.data.toString().toLowerCase().includes(this.searchFormGroup.controls[id].value.toString().toLowerCase())) {
          searchedRow = true;
        }
      });
      return searchedRow;
    });
    console.log(this.customDataFiltered);

  }

  async searchFromDate(id: string) {
    const completeId = id + ';from';
    this.customDataFiltered = await this.customTable.customData.filter((row) => {
      let searchedRow = false;
      row.customDataMap.filter((col) => {
        return col.customColDefinition.id === id && col.customCol.data != null;
      }).forEach((col) => {
        /**
         * DO WHEN UNTIL DATE NOT SET
         */
        console.log(this.searchFormGroup.controls[id + ';to'].value);
        if (this.searchFormGroup.controls[id + ';to'].value === null || this.searchFormGroup.controls[id + ';to'].value === undefined || this.searchFormGroup.controls[id + ';to'].value === '' ) {
          const customDate: Date = new Date(col.customCol.data);
          const filterDate: Date = new Date(this.searchFormGroup.controls[completeId].value);
          console.log(customDate);
          console.log(filterDate);
          if (customDate.getTime() >= filterDate.getTime()) {
            searchedRow = true;
            console.log(true);
          }
        } else {
          /**
           * DO WHEN UNTIL DATE IS SET
           */
          const customDate: Date = new Date(col.customCol.data);
          const filterDateFrom: Date = new Date(this.searchFormGroup.controls[completeId].value);
          const filterDateUntil: Date = new Date(this.searchFormGroup.controls[id + ';to'].value);
          if (customDate.getTime() >= filterDateFrom.getTime() && customDate.getTime() <= filterDateUntil.getTime()) {
            searchedRow = true;
          }
        }
      });
      return searchedRow;
    });
  }

  async searchToDate(id: string) {
    const completeId = id + ';to';

    this.customDataFiltered = await this.customTable.customData.filter((row) => {
      let searchedRow = false;
      row.customDataMap.filter((col) => {
        return col.customColDefinition.id === id && col.customCol.data != null;
      }).forEach((col) => {
        /**
         * DO WHEN FROM DATE NOT SET
         */
        if (this.searchFormGroup.controls[id + ';from'].value === null || this.searchFormGroup.controls[id + ';from'].value === undefined || this.searchFormGroup.controls[id + ';from'].value === '') {
          const customDate: Date = new Date(col.customCol.data);
          const filterDate: Date = new Date(this.searchFormGroup.controls[completeId].value);
          console.log(customDate);
          console.log(filterDate);
          if (customDate.getTime() <= filterDate.getTime()) {
            searchedRow = true;
            console.log(true);
          }
        } else {
          /**
           * DO WHEN FROM DATE IS SET
           */
          const customDate: Date = new Date(col.customCol.data);
          const filterDateFrom: Date = new Date(this.searchFormGroup.controls[id + ';from'].value);
          const filterDateUntil: Date = new Date(this.searchFormGroup.controls[completeId].value);
          if (customDate.getTime() >= filterDateFrom.getTime() && customDate.getTime() <= filterDateUntil.getTime()) {
            searchedRow = true;
          }
        }
      });
      return searchedRow;
    });
  }

  submitDelete() {
    console.log(this.customTable);
    this.customTableService.deleteCustomTable(this.customTable.id).then((result) => {
      if (result.ok) {
        alert('Deletion completed!');
        this.router.navigate(['/data']);
      } else {
        alert('Something went wrong!');
        window.location.reload();
      }
    });
  }

  async searchFromTime(input: CustomColDefinition) {
    this.customDataFiltered = await this.customTable.customData.filter((row) => {
      let searchedRow = false;
      row.customDataMap.filter((col) => {
        return col.customColDefinition.id === input.id && col.customCol.data != null;
      }).forEach((col) => {
        /**
         * DO WHEN UNTIL DATE NOT SET
         */
        console.log(this.searchFormGroup.controls[input.id + ';to'].value);
        if (this.searchFormGroup.controls[input.id + ';to'].value === null || this.searchFormGroup.controls[input.id + ';to'].value === undefined || this.searchFormGroup.controls[input.id + ';to'].value === '') {
          const customDate: Date = new Date();
          customDate.setHours(col.customCol.data.toString().split(':')[0]);
          customDate.setMinutes(col.customCol.data.toString().split(':')[1]);
          const filterDate: Date = new Date();
          filterDate.setHours(this.searchFormGroup.controls[input.id + ';from'].value.toString().split(':')[0]);
          filterDate.setMinutes(this.searchFormGroup.controls[input.id + ';from'].value.toString().split(':')[1]);
          console.log(customDate);
          console.log(filterDate);
          if (customDate.getTime() >= filterDate.getTime()) {
            searchedRow = true;
            console.log(true);
          }
        } else {
          /**
           * DO WHEN UNTIL DATE IS SET
           */
          const customDate: Date = new Date();
          customDate.setHours(col.customCol.data.toString().split(':')[0]);
          customDate.setMinutes(col.customCol.data.toString().split(':')[1]);
          const filterDateFrom: Date = new Date();
          filterDateFrom.setHours(this.searchFormGroup.controls[input.id + ';from'].value.toString().split(':')[0]);
          filterDateFrom.setMinutes(this.searchFormGroup.controls[input.id + ';from'].value.toString().split(':')[1]);
          const filterDateUntil: Date = new Date();
          filterDateUntil.setHours(this.searchFormGroup.controls[input.id + ';to'].value.toString().split(':')[0]);
          filterDateUntil.setMinutes(this.searchFormGroup.controls[input.id + ';to'].value.toString().split(':')[1]);
          if (customDate.getTime() >= filterDateFrom.getTime() && customDate.getTime() <= filterDateUntil.getTime()) {
            searchedRow = true;
          }
        }
      });
      return searchedRow;
    });
  }

  async searchToTime(input: CustomColDefinition) {
    this.customDataFiltered = await this.customTable.customData.filter((row) => {
      let searchedRow = false;
      row.customDataMap.filter((col) => {
        return col.customColDefinition.id === input.id && col.customCol.data != null;
      }).forEach((col) => {
        /**
         * DO WHEN FROM DATE NOT SET
         */
        if (this.searchFormGroup.controls[input.id + ';from'].value === null || this.searchFormGroup.controls[input.id + ';from'].value === undefined || this.searchFormGroup.controls[input.id + ';from'].value === '') {
          const customDate: Date = new Date();
          customDate.setHours(col.customCol.data.toString().split(':')[0]);
          customDate.setMinutes(col.customCol.data.toString().split(':')[1]);
          const filterDate: Date = new Date();
          filterDate.setHours(this.searchFormGroup.controls[input.id + ';to'].value.toString().split(':')[0]);
          filterDate.setMinutes(this.searchFormGroup.controls[input.id + ';to'].value.toString().split(':')[1]);
          console.log(customDate);
          console.log(filterDate);
          if (customDate.getTime() <= filterDate.getTime()) {
            searchedRow = true;
            console.log(true);
          }
        } else {
          /**
           * DO WHEN FROM DATE IS SET
           */
          const customDate: Date = new Date();
          customDate.setHours(col.customCol.data.toString().split(':')[0]);
          customDate.setMinutes(col.customCol.data.toString().split(':')[1]);

          const filterDateFrom: Date = new Date();
          filterDateFrom.setHours(this.searchFormGroup.controls[input.id + ';from'].value.toString().split(':')[0]);
          filterDateFrom.setMinutes(this.searchFormGroup.controls[input.id + ';from'].value.toString().split(':')[1]);

          const filterDateUntil: Date = new Date();
          filterDateUntil.setHours(this.searchFormGroup.controls[input.id + ';to'].value.toString().split(':')[0]);
          filterDateUntil.setMinutes(this.searchFormGroup.controls[input.id + ';to'].value.toString().split(':')[1]);
          if (customDate.getTime() >= filterDateFrom.getTime() && customDate.getTime() <= filterDateUntil.getTime()) {
            searchedRow = true;
          }
        }
      });
      return searchedRow;
    });
  }

  isCustomColDefinition(object: string| CustomColDefinition): object is CustomColDefinition {
    return (object as CustomColDefinition).id !== undefined;
  }

  getValueForCalcCol(col: CustomDataMap, data: CustomRow): string {
    let result: string;
    result = this.getValueForCell(col, data);
    return result;
  }

  getValueForCell(col: CustomDataMap, data: CustomRow): string {
    let expressionString = '';
    col.customColDefinition.calculatedCol.expressionToCalculate.forEach((x) => {
      if (this.isCustomColDefinition(x)) {
        data.customDataMap.filter((dm) => dm.customColDefinition.id === x.id).forEach((dm) => {
          expressionString += dm.customCol.data.toString();
        });
      } else {
        expressionString += x;
      }
    });
    try {
      return evaluate(expressionString);
    } catch (e) {
      console.log(e);
      return 'Not solvable!';
    }
  }

  async searchCalculated(input: CustomColDefinition) {
    this.customDataFiltered = await this.customTable.customData.filter((row) => {
      let searchedRow = false;
      row.customDataMap.filter((dataMap) => dataMap.customColDefinition.id === input.id).forEach((dataMap) => {
        console.log(this.getValueForCalcCol(dataMap, row).toString());
        console.log(this.searchFormGroup.controls[input.id].value.toString());
        searchedRow = this.getValueForCalcCol(dataMap, row).toString().includes(this.searchFormGroup.controls[input.id].value.toString());
      });
      return searchedRow;
    });
  }

  async deleteCalculatedColumn(col: CustomColDefinition) {

    await this.customTable.customData.filter((row) => {
      row.customDataMap.forEach((dataMap) => {
        const index = row.customDataMap.indexOf(dataMap);
        if (dataMap.customColDefinition.colNr === col.colNr) {
          row.customDataMap.splice(index, 1);
        }
      });
    });

    await this.customDataFiltered.filter((row) => {
      row.customDataMap.forEach((dataMap) => {
        const index = row.customDataMap.indexOf(dataMap);
        if (dataMap.customColDefinition.colNr === col.colNr) {
          row.customDataMap.splice(index, 1);
        }
      });
    });

    const colIndex = this.customSchema.customColDefinitionSet.indexOf(col);
    this.customSchema.customColDefinitionSet.splice(colIndex, 1);
  }

  async generatePdf() {

    const doc = new jsPDF('landscape');

    const bodyElements = [];
    const headerElements = [];
    await this.customDataFiltered.forEach((row) => {
      const rowEl = [];
      row.customDataMap.forEach((dataMap) => {
        if (dataMap.customColDefinition.datatype.toLowerCase() !== 'calculated') {
          rowEl.push(dataMap.customCol.data);
        } else {
          rowEl.push(this.getValueForCell(dataMap, row));
        }
      });
      bodyElements.push(rowEl);
    });

    await this.customSchema.customColDefinitionSet.forEach((schema) => headerElements.push(schema.name));

    doc.autoTable({
      head: [headerElements],
      body: bodyElements
    });
    doc.save('table.pdf');
  }
}

