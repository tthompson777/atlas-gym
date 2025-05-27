import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private readonly API = 'http://localhost:3000/api/empresas';

  buscarPorUid(uid: string): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.API}/by-uid/${uid}`);
  }

  cadastrar(empresa: NovaEmpresa): Observable<Empresa> {
    return this.http.post<Empresa>(this.API, empresa);
  }

  listarTodas(): Observable<any[]> {
  return this.http.get<any[]>(this.API);
}
}
