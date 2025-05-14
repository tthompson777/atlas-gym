import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import * as faceapi from 'face-api.js';
import { FaceRecognitionService } from '../services/face-recognition.service';
import { AlunosService, Aluno } from '../alunos/alunos.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-face-verification',
  standalone: true,
  imports: [NgIf],
  templateUrl: './face-verification.component.html',
})
export class FaceVerificationComponent implements OnInit {
  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('overlay') canvasRef!: ElementRef<HTMLCanvasElement>;

  descriptorsSalvos: { aluno: Aluno, descriptor: Float32Array }[] = [];
  alunoReconhecido: Aluno | null = null;
  modelosCarregados = false;

  constructor(
    private face: FaceRecognitionService,
    private alunosService: AlunosService
  ) {}

  async ngOnInit() {
    await this.face.loadModels();
    this.modelosCarregados = true;
    await this.iniciarCamera();

    this.videoRef.nativeElement.addEventListener('canplay', () => {
    console.log('Câmera pronta!');
  });
    this.carregarBaseDeAlunos();
  }

  async iniciarCamera() {
    const video = this.videoRef.nativeElement;
    const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
    video.srcObject = stream;
  }

  carregarBaseDeAlunos() {
  this.alunosService.listar().subscribe((alunos: any) => {
    for (const aluno of alunos) {
      if (aluno.descriptor) {
        this.descriptorsSalvos.push({ aluno, descriptor: new Float32Array(aluno.descriptor) });
      }
    }
    console.log(this.descriptorsSalvos);
  });
}

  async verificar() {
    const video = this.videoRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;
    await new Promise(res => setTimeout(res, 200));
    const detection = await this.face.detectFace(video);

    if (!detection) {
      alert('Nenhum rosto detectado!');
      return;
    }

      // Ajusta canvas sobre o vídeo
      faceapi.matchDimensions(canvas, video);
      const resized = faceapi.resizeResults(detection, video);

      // Desenha contornos
      faceapi.draw.drawDetections(canvas, resized);
      faceapi.draw.drawFaceLandmarks(canvas, resized);

    const entradaDescriptor = detection.descriptor;
    let menorDistancia = 1;
    let alunoMaisProvavel: Aluno | null = null;

    for (const registro of this.descriptorsSalvos) {
      const dist = this.face.computeDistance(entradaDescriptor, registro.descriptor);
      if (dist < menorDistancia && dist < 0.6) {
        menorDistancia = dist;
        alunoMaisProvavel = registro.aluno;
      }
    }

    if (alunoMaisProvavel) {
      this.alunoReconhecido = alunoMaisProvavel;
      console.log('Aluno reconhecido:', alunoMaisProvavel.nome);

      // REGISTRA A ENTRADA no banco:
      this.alunosService.registrarEntrada(alunoMaisProvavel.id).subscribe({
        next: () => {
          console.log('Entrada registrada com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao registrar entrada:', err);
        }
      });
    } else {
      alert('Aluno não reconhecido!');
      this.alunoReconhecido = null;
    }
  }
}
