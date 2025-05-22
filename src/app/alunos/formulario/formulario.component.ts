import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AlunosService, Aluno } from '../../services/alunos.service';
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
import { MatSnackBar } from '@angular/material/snack-bar'
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
  styleUrls: ['./formulario.component.scss'],
})
export class FormularioComponent implements OnInit {
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
    status: 'Pendente',
    criadoEm: ''
  };

  editando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alunosService: AlunosService,
    private snackBar: MatSnackBar
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

  async ngOnInit() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models/tiny_face_detector');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models/face_landmark_68');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models/face_recognition');
  }

  captureImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.aluno.fotoBase64 = webcamImage.imageAsDataUrl; // base64 para enviar ao backend
  }

  private mostrarMensagem(mensagem: string) {
    this.snackBar.open(mensagem, 'Fechar', {
      duration: 4000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['snack-danger']
    });
  }

  async salvar() {
    if (!this.aluno.fotoBase64) {
      this.mostrarMensagem('Por favor, capture uma foto do aluno antes de salvar.');
      return;
    }

    if (!this.aluno.senha) {
      this.mostrarMensagem('Crie uma senha de acesso para o aluno.');
      return;
    }

    if (!this.aluno.cpf || !this.aluno.nome || !this.aluno.sexo || !this.aluno.nascimento || !this.aluno.senha) {
      this.mostrarMensagem('Preencha todos os campos obrigatórios.'); 
      return;
    }

    // Aguarda imagem carregar corretamente no DOM para geração do descriptor
    const descriptor = await this.gerarDescriptor(this.aluno.fotoBase64);
    if (!descriptor) {
      this.mostrarMensagem('Não foi possível identificar o rosto na imagem. Tente novamente.');
      return;
    }

    this.aluno.descriptor = Array.from(descriptor);

    const request = this.editando
      ? this.alunosService.atualizar(this.aluno)
      : this.alunosService.criar(this.aluno);

    request.subscribe({
      next: () => {
        this.router.navigate(['/alunos']);
      },
      error: (err) => {
        const msg = err?.error?.mensagem ?? 'Erro ao salvar aluno.';
        this.mostrarMensagem(msg);
      }
    });

  }

  async gerarDescriptor(fotoBase64: string): Promise<Float32Array | null> {
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
