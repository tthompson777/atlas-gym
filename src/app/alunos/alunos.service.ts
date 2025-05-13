import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Aluno {
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
  status: 'Ativo' | 'Inativo';
}

@Injectable({ providedIn: 'root' })
export class AlunosService {
  private API = 'http://localhost:3000/api/alunos';

  constructor(private http: HttpClient) {}

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
}
