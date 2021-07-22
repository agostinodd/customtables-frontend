import { Component, OnInit } from '@angular/core';
import {CustomTableService} from '../../services/custom-table.service';
import {CustomTable} from '../../Models/custom-table';
import {CustomColDefinition} from '../../Models/custom-col-definition';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HttpResponse} from '@angular/common/http';
import {CustomDataType} from '../../Models/custom-data-type.enum';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-add-customtable',
  templateUrl: './add-customtable.component.html',
  styleUrls: ['./add-customtable.component.scss']
})
export class AddCustomtableComponent implements OnInit {

  constructor(private tableService: CustomTableService) { }

  customTable: FormGroup;
  customSchema: FormGroup;

  customSchemaEntries: Array<CustomColDefinition> = [];
  customColDefinitionSet: FormControl;


  customSchemaInputName: FormControl;
  customSchemaInputDatatype: FormControl;


  TEXTTYPE = CustomDataType.TEXT;
  LONGTEXTTYPE = CustomDataType.LONGTEXT;
  NUMBERTYPE = CustomDataType.NUMBER;
  DATETYPE = CustomDataType.DATE;
  INTERNETTYPE = CustomDataType.INTERNET;
  EMAILTYPE = CustomDataType.EMAIL;
  TIMETYPE = CustomDataType.TIME;
  PHONETYPE = CustomDataType.PHONE;

  ngOnInit() {

    this.customSchemaInputName = new FormControl('', [Validators.required, Validators.maxLength(15)]);
    this.customSchemaInputDatatype = new FormControl('', [Validators.required, Validators.maxLength(15)]);

    this.customColDefinitionSet = new FormControl();

    this.customSchema = new FormGroup({
      customColDefinitionSet: this.customColDefinitionSet
    });

    this.customTable = new FormGroup({
      customSchema: this.customSchema,
      customSchemaInputName: this.customSchemaInputName,
      customSchemaInputDatatype: this.customSchemaInputDatatype
    });
  }

  getMail() {
    const mailString = environment.testEmail;
    return mailString;
  }

  submit() {
    this.customColDefinitionSet.setValue(this.customSchemaEntries);
    const customTableData: CustomTable = {
      customSchema: {
        customColDefinitionSet: this.customColDefinitionSet.value
      },
      ownerMail: this.getMail(),
      customData: [],
    };

    this.tableService.newCustomTable(customTableData).then((result1) => {
      if (result1.status === 200) {
        alert('Tabelle erfolgreich abgespeichert!');
      } else if (result1.status === 400) {
        alert('Sie besitzen bereits eine Tabelle!');
      } else {
        alert('Etwas ist schief gelaufen! Versuchen Sie es später erneut!');
      }
    }).catch((error) => {
      if(error.status === 400){
        alert('Sie besitzen bereits eine Tabelle! Fehlercode: ' + error.status);
      }
    });
  }

  onDelete(customSchemas: CustomColDefinition) {
    const index = this.customSchemaEntries.indexOf(customSchemas);
    this.customSchemaEntries.splice(index, 1);
  }

  addColDef() {
    if (this.customSchemaInputName.valid && this.customSchemaInputDatatype.valid) {
      this.customSchemaEntries.push({
        name: this.customSchemaInputName.value,
        colNr: this.customSchemaEntries.length,
        datatype: this.customSchemaInputDatatype.value
      });
      this.customSchemaInputName.reset();
      this.customSchemaInputDatatype.reset();
    }

  }
}
