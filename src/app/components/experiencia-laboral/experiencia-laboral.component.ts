import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-experiencia-laboral',
  templateUrl: './experiencia-laboral.component.html',
  styleUrls: ['./experiencia-laboral.component.scss'],
  standalone: false
})
export class ExperienciaLaboralComponent implements OnInit {

  formulario!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.formulario = this.fb.group({
      empresa: [''],
      anioInicio: [''],
      trabajaActualmente: [false],
      anioTermino: [''],
      cargo: ['']
    });
  }

  toggleTrabajaActualmente() {
    const trabaja = this.formulario.get('trabajaActualmente')?.value;
    if (trabaja) {
      this.formulario.get('anioTermino')?.setValue('');
    }
  }

  guardar() {
    console.log('Datos guardados:', this.formulario.value);
  }
}

