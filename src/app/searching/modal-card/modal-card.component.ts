import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClientService } from '../../HttpClient/HttpClient.service';
import { MatDialog } from '@angular/material/dialog';

export class Element {
  name: string;
  url: string;
}

export class Pokemon {
  name: string;
  url: string;
}


let ELEMENT_DATA: Element[] = [];

@Component({
  selector: 'app-modal-card',
  templateUrl: './modal-card.component.html',
  styleUrls: ['./modal-card.component.scss']
})
export class ModalCardComponent implements OnInit {

  name;
  peso;
  altura;
  habilidades;
  displayedColumns: string[] = ['Name', 'Link', 'pokemons'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  selectedValue: string;
  pokemones: Pokemon[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public httpClient: HttpClientService,private dialog: MatDialog) { 
    this.name = data.name;
    this.peso = data.peso;
    this.altura = data.altura;
    this.habilidades = data.habilidades;
    console.log(this.habilidades);
    this.habilidades.forEach(value => {
      let element = new Element();
      element.name = value.ability.name;
      element.url = value.ability.url;

      this.httpClient.Get(value.ability.url).subscribe(res => {
        console.log(res);
        res.pokemon.forEach(value => {
          let pok = new Pokemon();
          pok.name = value.pokemon.name;
          pok.url = value.pokemon.url;
          this.pokemones.push(pok);
        });
      });
      ELEMENT_DATA.push(element);
      this.dataSource = new MatTableDataSource(ELEMENT_DATA);
    });
  }

  ngOnInit() {
  }

  select(value:Event){
    console.log(this.selectedValue);
    this.httpClient.Get("https://pokeapi.co/api/v2/pokemon/" + this.selectedValue).subscribe(res => {
      console.log(res);
     
      const dialogRef = this.dialog.open(ModalCardComponent, {
        data: {
          name: res.name,
          peso: res.weight,
          altura: res.height,
          habilidades: res.abilities
        },
        width: '70%',
        height: '80%',
      }); 
    
    });
  }
}
