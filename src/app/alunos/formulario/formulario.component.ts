import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlunosService, Aluno } from '../alunos.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { WebcamImage } from 'ngx-webcam';
import { Subject, Observable } from 'rxjs';
import { NgIf } from '@angular/common';
import { WebcamModule } from 'ngx-webcam';
import * as faceapi from 'face-api.js';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [
    RouterModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatToolbarModule,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    WebcamModule,
  ],
  templateUrl: './formulario.component.html',
})
export class FormularioComponent {
  trigger: Subject<void> = new Subject<void>();
  webcamImage?: WebcamImage;
  triggerObservable: Observable<void> = this.trigger.asObservable();

  aluno: Aluno = {
    fotoBase64: '',
    id: 0,
    nome: '',
    sexo: '',
    nascimento: '',
    telefone: '',
    email: '',
    cpf: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    pais: '',
    status: 'Ativo',
  };

  editando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alunosService: AlunosService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.alunosService.obter(+id).subscribe((alunoEncontrado) => {
        if (alunoEncontrado) {
          this.aluno = { ...alunoEncontrado };
          this.editando = true;
        }
      });
    }
  }

  captureImage(webcamImage: WebcamImage): void {
  this.webcamImage = webcamImage;
  this.aluno.fotoBase64 = webcamImage.imageAsDataUrl; // base64 para enviar ao backend
}

async salvar() {
  if (!this.aluno.fotoBase64) {
    alert('Por favor, capture uma foto do aluno antes de salvar.');
    return;
  }

  if (this.webcamImage) {
    const descriptor = await this.gerarDescriptor(this.webcamImage.imageAsDataUrl);
    if (descriptor) {
      this.aluno.descriptor = Array.from(descriptor);
    }
  }

  if (this.editando) {
    this.alunosService.atualizar(this.aluno).subscribe(() => {
      this.router.navigate(['/alunos']);
    });
  } else {
    this.alunosService.criar(this.aluno).subscribe(() => {
      this.router.navigate(['/alunos']);
    });
  }
}

async gerarDescriptor(fotoBase64: string): Promise<Float32Array | null> {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models/tiny_face_detector');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models/face_landmark_68');
  await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models/face_recognition');

  const img = new Image();
  img.src = fotoBase64;
  await new Promise((res) => (img.onload = res));

  const detection = await faceapi
    .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();

  return detection?.descriptor || null;
}

}
