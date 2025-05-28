import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const URL_API = environment.URL;

interface Empresa {
  id: string;
  nome: string;
  email: string;
  uid: string;
}

export interface NovaEmpresa {
  nome: string;
  email: string;
  uid: string;
}

@Injectable({ providedIn: 'root' })
export class EmpresaService {
  constructor(private http: HttpClient) {}
  private readonly API = `${URL_API}/empresas`;

  buscarMinhaEmpresa(): Observable<Empresa> {
  return this.http.get<Empresa>(`${this.API}/minha`);
}

  cadastrar(empresa: NovaEmpresa): Observable<Empresa> {
    return this.http.post<Empresa>(this.API, empresa);
  }

  listarTodas(): Observable<any[]> {
  return this.http.get<any[]>(this.API);
}
}
