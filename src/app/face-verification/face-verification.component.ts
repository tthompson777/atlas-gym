import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FaceRecognitionService } from '../services/face-recognition.service';
import { AlunosService, Aluno } from '../services/alunos.service';
import { NgIf } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BoasVindasSnackbarComponent } from '../shared/boas-vindas-snackbar/boas-vindas-snackbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BotaoComponent } from '../shared/botao/botao.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-face-verification',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    NgIf,
    MatSnackBarModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    BotaoComponent,
    MatInputModule,
  ],
  templateUrl: './face-verification.component.html',
  styleUrls: ['./face-verification.component.scss'],
})
export class FaceVerificationComponent implements OnInit {
  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;

  senhaDigitada: string = '';
  contadorProximoAluno: number | null = null;
  verificacaoAutomaticaAtiva = false;
  descriptorsSalvos: { aluno: Aluno, descriptor: Float32Array }[] = [];
  alunoReconhecido: Aluno | null = null;
  modelosCarregados = false;
  alunoInativo = false;

  constructor(
    private face: FaceRecognitionService,
    private alunosService: AlunosService,
    private snackBar: MatSnackBar,
  ) { }

  async ngOnInit() {
    await this.face.loadModels();
    this.modelosCarregados = true;
    await this.iniciarCamera();

    this.videoRef.nativeElement.addEventListener('canplay', () => {
      console.log('Câmera pronta!');
    });
    this.carregarBaseDeAlunos();

    this.iniciarVerificacaoAutomatica();
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

  iniciarContadorReinicio() {
    this.contadorProximoAluno = 5;

    const intervalo = setInterval(() => {
      if (this.contadorProximoAluno! > 1) {
        this.contadorProximoAluno!--;
      } else {
        clearInterval(intervalo);
        this.contadorProximoAluno = null;
        this.alunoReconhecido = null;
        this.verificacaoAutomaticaAtiva = false;
        this.iniciarVerificacaoAutomatica();
      }
    }, 1000);
  }


  iniciarVerificacaoAutomatica() {
    if (this.verificacaoAutomaticaAtiva || this.alunoReconhecido || this.contadorProximoAluno !== null) return;

    this.verificacaoAutomaticaAtiva = true;

    const intervalo = setInterval(async () => {
      if (!this.verificacaoAutomaticaAtiva || this.alunoReconhecido || this.contadorProximoAluno !== null) {
        clearInterval(intervalo);
        return;
      }

      const video = this.videoRef.nativeElement;

      const detection = await this.face.detectFace(video);

      if (detection) {

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
          this.verificacaoAutomaticaAtiva = false;
          this.alunoReconhecido = alunoMaisProvavel;

          const alunoLiberado = alunoMaisProvavel.status?.toLowerCase() === 'ativo';

          const snackRef = this.snackBar.openFromComponent(BoasVindasSnackbarComponent, {
            data: {
              nome: alunoMaisProvavel.nome,
              foto: alunoMaisProvavel.fotoBase64,
              mensagem: alunoLiberado
                ? 'Tudo certo!'
                : 'Procure o atendimento para mais informações!'
            },
            duration: 6000,
            panelClass: [
              'snack-centralizado',
              alunoLiberado ? 'snack-liberado' : 'snack-danger'
            ]
          });

          // Quando o snackbar desaparecer, reinicia a verificação
          snackRef.afterDismissed().subscribe(() => {
            this.alunoReconhecido = null;
            this.verificacaoAutomaticaAtiva = false;
            this.iniciarVerificacaoAutomatica();
            this.iniciarContadorReinicio();
          });


          if (alunoLiberado) {
            this.alunosService.registrarAcesso(alunoMaisProvavel.id).subscribe({
              next: (res: any) => {
                if (res.tipo === 'entrada') {
                  console.log(`Entrada registrada às ${new Date(res.registro.dataEntrada).toLocaleTimeString()}`);
                } else {
                  console.log(`Saída registrada às ${new Date(res.registro.dataSaida).toLocaleTimeString()}`);
                }
              },
              error: err => console.error('Erro ao registrar acesso:', err)
            });
          }
        }
      }
    }, 1000); // tenta a cada 1 segundo
  }


  reiniciarVerificacao() {
    this.alunoReconhecido = null;
    this.verificacaoAutomaticaAtiva = false;
    this.iniciarVerificacaoAutomatica();
  }

  async verificar() {
    if (this.contadorProximoAluno !== null) return;

    const video = this.videoRef.nativeElement;
    await new Promise(res => setTimeout(res, 200));
    const detection = await this.face.detectFace(video);

    if (!detection) {
      alert('Nenhum rosto detectado!');
      return;
    }

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

      const alunoLiberado = alunoMaisProvavel.status?.toLowerCase() === 'ativo';

      this.snackBar.openFromComponent(BoasVindasSnackbarComponent, {
        data: {
          nome: alunoMaisProvavel.nome,
          foto: alunoMaisProvavel.fotoBase64,
          mensagem: alunoMaisProvavel.status?.toLowerCase() === 'inativo'
            ? 'Procure o atendimento para mais informações!'
            : 'Que bom que você veio!'
        },
        duration: 6000,
        panelClass: [
          'snack-centralizado',
          alunoLiberado ? 'snack-liberado' : 'snack-danger'
        ]
      });

      if (alunoMaisProvavel.status?.toLowerCase() !== 'inativo') {
        this.alunosService.registrarAcesso(alunoMaisProvavel.id).subscribe({
          next: (res: any) => {
            if (res.tipo === 'entrada') {
              console.log(`Entrada registrada às ${new Date(res.registro.dataEntrada).toLocaleTimeString()}`);
            } else {
              console.log(`Saída registrada às ${new Date(res.registro.dataSaida).toLocaleTimeString()}`);
            }
          },
          error: err => console.error('Erro ao registrar acesso:', err)
        });
      }
    }
    else {
      this.alunoInativo = false;
      this.alunoReconhecido = null;
    }
  }

  verificarSenha() {
    if (!this.senhaDigitada) {
      this.snackBar.open('Digite sua senha', 'Fechar', { duration: 3000 });
      return;
    }

    this.alunosService.autenticarPorSenha(this.senhaDigitada).subscribe({
      next: (aluno: Aluno) => {
        const liberado = aluno.status?.toLowerCase() === 'ativo';

        this.snackBar.openFromComponent(BoasVindasSnackbarComponent, {
          data: {
            nome: aluno.nome,
            foto: aluno.fotoBase64,
            mensagem: liberado
              ? 'Que bom que você veio!'
              : 'Procure o atendimento para mais informações!'
          },
          duration: 6000,
          panelClass: [
            'snack-centralizado',
            liberado ? 'snack-liberado' : 'snack-danger'
          ]
        });

        if (liberado) {
          this.alunosService.registrarAcesso(aluno.id).subscribe({
            next: (res: any) => {
              if (res.tipo === 'entrada') {
                console.log(`Entrada registrada às ${new Date(res.registro.dataEntrada).toLocaleTimeString()}`);
              } else {
                console.log(`Saída registrada às ${new Date(res.registro.dataSaida).toLocaleTimeString()}`);
              }
            },
            error: err => console.error('Erro ao registrar acesso:', err)
          });
        }

        this.senhaDigitada = '';
      },
      error: err => {
        console.error(err);
        this.snackBar.open('Senha incorreta ou aluno não encontrado', 'Fechar', { duration: 3000 });
        this.senhaDigitada = '';
      }
    });
  }

}
