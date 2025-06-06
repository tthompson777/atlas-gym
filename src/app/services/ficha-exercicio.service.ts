import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const URL_API = environment.URL;

export interface Exercicio {
  grupo: string;
  nome: string;
  series: number;
  repeticoes: number;
}

export interface FichaExercicio {
  id?: number;
  alunoId: number;
  dataCriacao?: string;
  exercicios: Exercicio[];
  aluno?: {
    id: number;
    nome: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class FichaExercicioService {
  private readonly API = `${URL_API}/fichas`;

  constructor(private http: HttpClient) {}

  listar(): Observable<FichaExercicio[]> {
    return this.http.get<FichaExercicio[]>(this.API);
  }

  obter(id: number): Observable<FichaExercicio> {
    return this.http.get<FichaExercicio>(`${this.API}/${id}`);
  }

  criar(ficha: FichaExercicio): Observable<FichaExercicio> {
    return this.http.post<FichaExercicio>(this.API, ficha);
  }

  atualizar(id: number, ficha: FichaExercicio): Observable<FichaExercicio> {
    return this.http.put<FichaExercicio>(`${this.API}/${id}`, ficha);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }

  buscarPorAluno(alunoId: number): Observable<{ id: number }> {
    return this.http.get<{ id: number }>(`${this.API}/por-aluno/${alunoId}`);
  }
}
