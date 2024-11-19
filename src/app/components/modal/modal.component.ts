import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  // acesta este inclus in pagina /user/professor/calsses/:id
  // se va deschide 85% din ecran cu decline si accept la appointment
}
