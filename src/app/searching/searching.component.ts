import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../HttpClient/HttpClient.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorModalComponent } from '../errors/ErrorModal/error-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalTransactionComponent } from './modal-transaction/modal-transaction.component';
import { PageEvent } from '@angular/material/paginator';


export class Element {
  name: string;
  link: string;
}
let ELEMENT_DATA: Element[] = [];
let allPokemons: Element[] = [];
let FILTERED_ELEMENT_DATA: Element[] = [];

@Component({
  selector: 'app-searching',
  templateUrl: './searching.component.html',
  styleUrls: ['./searching.component.scss']
})
export class SearchingComponent implements OnInit {

  removable = true;
  selectedValue: string;
  startDate = "1940-01-01";
  endDate = "2050-01-01";
  startDateDate = new Date(this.startDate);
  endDateDate = new Date(this.endDate);
  displayedColumns: string[] = ['Name', 'Link a tarjeta'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  types = new FormControl();
  typesList: string[] = ['All','redeem', 'earn'];
  resultsLength = 0;
  currentIndex = 0;
  nxtPage = "";
  prvPage = "";
  isLoadingResults = false;

  constructor(
    public httpClient: HttpClientService,
    private dialog: MatDialog,
    private readonly router: Router
  ) { 

  }

  ngOnInit(): void {
    
    this.httpClient.GetPokemons().subscribe(res => {
      this.resultsLength = res.count;
      this.nxtPage = res.next;
      let nextp = res.next;
      while(nextp != null){
        console.log(nextp);
        this.httpClient.Get(nextp).subscribe(res => {
          console.log(res);
          nextp = res.next;
          console.log(nextp);
          
          res.results.forEach((value, index) => {
            let element = new Element();
            element.name = value.name;
            element.link = value.url;
            allPokemons.push(element);
          });
        },
        err => {
          const dialogRef = this.dialog.open(ErrorModalComponent, {
               width: '40%',
               height: '30%', 
               data: {
                message: "Error in token"
               }
            }
          );
    
          dialogRef.afterClosed().subscribe(result => {
            this.router.navigate([``]);
          });
    
        });
      }

      console.log(allPokemons);

      this.prvPage = res.previous;
      res.results.forEach((value, index) => {
        let element = new Element();
        element.name = value.name;
        element.link = value.url;
        ELEMENT_DATA.push(element);
        allPokemons.push(element);
        this.dataSource = new MatTableDataSource(ELEMENT_DATA);
      });
    },
    err => {
      const dialogRef = this.dialog.open(ErrorModalComponent, {
           width: '40%',
           height: '30%', 
           data: {
            message: "Error in token"
           }
        }
      );

      dialogRef.afterClosed().subscribe(result => {
        this.router.navigate([``]);
      });

    });


  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue);
    allPokemons.forEach((value, index) => {
      if(value.name.includes(filterValue)){
        FILTERED_ELEMENT_DATA.push(value);
        this.dataSource = new MatTableDataSource(FILTERED_ELEMENT_DATA);
      }
    });
  }

  public onChangePage(event?:PageEvent){
    if(this.currentIndex < event.pageIndex){
      this.isLoadingResults = true;
      this.currentIndex = event.pageIndex;
      ELEMENT_DATA = [];
      this.httpClient.Get(this.nxtPage).subscribe(res => {
        console.log(res);
        this.nxtPage = res.next;
        this.prvPage = res.previous;
        res.results.forEach((value, index) => {
          let element = new Element();
          element.name = value.name;
          element.link = value.url;
          ELEMENT_DATA.push(element);
          this.dataSource = new MatTableDataSource(ELEMENT_DATA);
          this.isLoadingResults = false;
        });
      },
      err => {
        const dialogRef = this.dialog.open(ErrorModalComponent, {
             width: '40%',
             height: '30%', 
             data: {
              message: "Error in token"
             }
          }
        );
  
        dialogRef.afterClosed().subscribe(result => {
          this.router.navigate([``]);
        });
  
      });
    }
    else if(this.currentIndex > event.pageIndex){
      this.isLoadingResults = true;
        this.currentIndex = event.pageIndex;
        ELEMENT_DATA = [];
        console.log(this.prvPage);
        this.httpClient.Get(this.prvPage).subscribe(res => {
          this.nxtPage = res.next;
          this.prvPage = res.previous;
          res.results.forEach((value, index) => {
            let element = new Element();
            element.name = value.name;
            element.link = value.url;
            ELEMENT_DATA.push(element);
            this.dataSource = new MatTableDataSource(ELEMENT_DATA);
            this.isLoadingResults = false;
          });
        },
        err => {
          const dialogRef = this.dialog.open(ErrorModalComponent, {
               width: '40%',
               height: '30%', 
               data: {
                message: "Error in token"
               }
            }
          );
    
          dialogRef.afterClosed().subscribe(result => {
            this.router.navigate([``]);
          });
        });
    }
  }

  rowOnClick(row){
    console.log("click");
    console.log(row);

    let date = new Date (row.date);
    let dateString = date.toLocaleDateString();
    const dialogRef = this.dialog.open(ModalTransactionComponent, {
      data: {
        type: row.type,
        points: row.points,
        date: dateString,
        value: row.value
      },
      width: '50%',
      height: '60%',
    }); 
  }
}
