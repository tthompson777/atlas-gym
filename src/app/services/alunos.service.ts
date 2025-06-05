import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const API_URL = environment.URL;

export interface Aluno {
  fotoBase64: string;
  id: number;
  nome: string;
  sexo: string;
  nascimento: string;
  telefone?: string;
  email?: string;
  cpf: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  pais?: string;
  descriptor?: number[];
  status: 'Ativo' | 'Inativo' | 'Pendente';
  criadoEm?: string;
  senha?: string;
}

@Injectable({ providedIn: 'root' })
export class AlunosService {
  private API = `${API_URL}/alunos`

  constructor(private http: HttpClient) { }

  listar() {
    return this.http.get<Aluno[]>(this.API);
  }

  obter(id: number) {
    return this.http.get<Aluno>(`${this.API}/${id}`);
  }

  criar(aluno: Omit<Aluno, 'id'>) {
    return this.http.post<Aluno>(this.API, aluno);
  }

  atualizar(aluno: Aluno) {
    return this.http.put<Aluno>(`${this.API}/${aluno.id}`, aluno);
  }

  excluir(id: number) {
    return this.http.delete(`${this.API}/${id}`);
  }

  inativar(id: number) {
    return this.http.patch<Aluno>(`${this.API}/${id}/inativar`, {});
  }

  // registrarAcesso(userId: number) {
  //   return this.http.post(`${API_URL}/registro-acesso`, userId);
  // }

  registrarAcesso(alunoId: number) {
  return this.http.post<any>(`${API_URL}/registro-acesso`, { alunoId });
}

  autenticarPorSenha(senha: string) {
    return this.http.post<Aluno>(`${API_URL}/alunos/autenticar-senha`, { senha });
  }
}
