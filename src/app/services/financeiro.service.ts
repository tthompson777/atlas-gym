import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Transacao } from '../models/transacao.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const URL_API = environment.URL;

@Injectable({ providedIn: 'root' })
export class FinanceiroService {
  private readonly api = `${URL_API}/financeiro`;

  constructor(private http: HttpClient) {}

  listar() {
    return this.http.get<Transacao[]>(this.api);
  }

  criar(transacao: Transacao) {
    return this.http.post<Transacao>(this.api, transacao);
  }

  excluir(id: number) {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  obter(id: number): Observable<Transacao> {
  return this.http.get<Transacao>(`${this.api}/${id}`);
}

atualizar(id: number, dados: Transacao): Observable<Transacao> {
  return this.http.put<Transacao>(`${this.api}/${id}`, dados);
}

gerarPagamento(id: number) {
  return this.http.post<{ paymentLink: string }>(`${this.api}/${id}/gerar-pagamento`, {});
}

}
