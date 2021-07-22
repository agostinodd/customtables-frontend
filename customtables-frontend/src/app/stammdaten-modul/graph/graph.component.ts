import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Route, Router } from '@angular/router';
import { CustomTableService } from '../../services/custom-table.service';
import { CustomTable } from '../../Models/custom-table';
import { Chart } from 'chart.js';
import { ClrWizard } from '@clr/angular';
import { FormControl, FormGroup } from '@angular/forms';
import { CustomColDefinition } from '../../Models/custom-col-definition';
import { evaluate } from 'mathjs';
import { CustomDataMap } from '../../Models/custom-data-map';
import { CustomRow } from '../../Models/custom-row';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit, AfterViewInit {


  @ViewChild('setupwizard', { static: false }) setupWizard: ClrWizard;

  @ViewChild('exampleCanvas', { static: true }) exampleCanvas: ElementRef<HTMLCanvasElement>;

  constructor(private customTableService: CustomTableService) { }

  setupWizardOpened: boolean;

  customTable: CustomTable;
  chart: Chart;
  exampleChart: Chart;
  canvas;

  chartFormGroup: FormGroup;
  chartType: FormControl;
  dataFormGroup: FormGroup;
  dataX: FormControl;
  dataY: FormControl;

  columns: CustomColDefinition[];
  labels = [];
  data = [];
  dataDesc;

  ngAfterViewInit(): void {
    // this.setupWizard.currentPageChanged.toPromise().then(() => this.initExampleChart());
  }


  ngOnInit() {
    this.columns = [];
    this.setupWizardOpened = true;

    this.customTableService.getCustomTable(this.getMail()).then((result) => {
      this.customTable = result;
    }).then(() => {
      this.customTable.customData.forEach((row) =>
      row.customDataMap.forEach((dataMap) =>{
        console.log(dataMap);
        this.columns.push(dataMap.customColDefinition)
        console.log(this.columns);
      }));
    });


    this.chartType = new FormControl('bar');
    this.chartFormGroup = new FormGroup({
      chartType: this.chartType
    });

    this.dataX = new FormControl();
    this.dataY = new FormControl();

    this.dataFormGroup = new FormGroup({
      dataX: this.dataX,
      dataY: this.dataY
    });
    // @ts-ignore
    this.canvas = document.getElementById('myChart').getContext('2d');
  }
  getMail() {
    const mailString = environment.testEmail;

    return mailString;
  }
  loadTable() {

  }

  changeDataX(event: any) {
    this.customTable.customData.forEach((row) => row.customDataMap.filter((dataMap) => dataMap.customColDefinition.id === this.dataX.value).forEach((map) => {
      if (map.customColDefinition.datatype.toLowerCase() !== 'calculated') {
        console.log(map);
        this.labels.push(map.customCol.data);
      } else {
        const result = this.getValueForCalcCol(map, row);
        this.labels.push(result);
      }
    }));
  }

  changeDataY(event: any) {
    this.customTable.customData.forEach((row) => row.customDataMap.filter((dataMap) => dataMap.customColDefinition.id === this.dataY.value).forEach((map) => {
      console.log(map);
      if (map.customColDefinition.datatype.toLowerCase() !== 'calculated') {
        this.data.push(map.customCol.data);
      } else {
        const result = this.getValueForCalcCol(map, row);
        this.data.push(result);
      }
      this.dataDesc = map.customColDefinition.name;
    }));
  }

  getValueForCalcCol(col: CustomDataMap, data: CustomRow): number {
    let result: number;
    result = this.getValueForCell(col, data);
    return result;
  }

  isCustomColDefinition(object: string | CustomColDefinition): object is CustomColDefinition {
    return (object as CustomColDefinition).id !== undefined;
  }

  getValueForCell(col: CustomDataMap, data: CustomRow): number {
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
      return null;
    }
  }

  createGraph() {
    const colorArr = [];
    this.data.forEach((data) => {
      const r = Math.random() * (255);
      const g = Math.random() * (255);
      const b = Math.random() * (255);
      colorArr.push('rgba(' + r + ',' + g + ',' + b + ',0.2)');
    });
    this.chart = new Chart(this.canvas, {
      type: this.chartType.value,
      data: {
        labels: this.labels,
        datasets: [{
          label: this.dataDesc,
          data: this.data,
          backgroundColor: colorArr,
          borderColor: 'rgba(0,0,0,0.3)',
          borderWidth: 1
        }]
      }
    });
  }

  initExampleChart() {
    // @ts-ignore
    this.exampleChart = new Chart(this.exampleCanvas.nativeElement.getContext('2d'), {
      type: this.chartType.value,
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }

  changeChartType() {
    const data = this.exampleChart.config.data;
    this.exampleChart.destroy();
    this.exampleChart = new Chart(this.exampleCanvas.nativeElement.getContext('2d'), {
      type: this.chartType.value,
      data,
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
    this.exampleChart.update();
  }


}
