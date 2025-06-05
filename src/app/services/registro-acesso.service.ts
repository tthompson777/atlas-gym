import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const URL_API = environment.URL;

export interface RegistroAcesso {
  dataEntrada: string;
  dataSaida?: string;
}

@Injectable({ providedIn: 'root' })
export class RegistroAcessoService {
  private api = `${URL_API}/registro-acesso`;

  constructor(private http: HttpClient) {}

  listarPorAluno(alunoId: number) {
    return this.http.get<RegistroAcesso[]>(`${this.api}/aluno/${alunoId}`);
  }
}
