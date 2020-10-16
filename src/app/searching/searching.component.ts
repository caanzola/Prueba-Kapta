import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../HttpClient/HttpClient.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorModalComponent } from '../errors/ErrorModal/error-modal.component';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ModalCardComponent } from './modal-card/modal-card.component';
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

  displayedColumns: string[] = ['Name', 'Link a tarjeta'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
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
    
    this.httpClient.GetPokemons().subscribe(async res => {
      this.resultsLength = res.count;
      this.nxtPage = res.next;
      this.prvPage = res.previous;
      res.results.forEach((value, index) => {
        let element = new Element();
        element.name = value.name;
        element.link = value.url;
        ELEMENT_DATA.push(element);
        allPokemons.push(element);
        this.dataSource = new MatTableDataSource(ELEMENT_DATA);
      });

      

      this.httpClient.GetAllPokemons().subscribe(res => {
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
    this.isLoadingResults = true;
    FILTERED_ELEMENT_DATA = [];
    const filterValue = (event.target as HTMLInputElement).value;
    if(filterValue.length > 0){
      allPokemons.forEach((value, index) => {
        if(value.name.includes(filterValue)){
          FILTERED_ELEMENT_DATA.push(value);
          this.dataSource = new MatTableDataSource(FILTERED_ELEMENT_DATA);
          this.isLoadingResults = false;
        }
      });
    }
    else{
      ELEMENT_DATA = [];
      this.httpClient.GetPokemons().subscribe(async res => {
        this.resultsLength = res.count;
        this.nxtPage = res.next;
        this.prvPage = res.previous;
        res.results.forEach((value, index) => {
          let element = new Element();
          element.name = value.name;
          element.link = value.url;
          ELEMENT_DATA.push(element);
          allPokemons.push(element);
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

    let name = row.name;
    
    this.httpClient.Get(row.link).subscribe(res => {
      console.log(res);
      const dialogRef = this.dialog.open(ModalCardComponent, {
        data: {
          name: name,
          peso: res.weight,
          altura: res.height,
          habilidades: res.abilities
        },
        width: '70%',
        height: '80%',
      }); 
    },
    err => {
      const dialogRef = this.dialog.open(ErrorModalComponent, {
           width: '80%',
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
