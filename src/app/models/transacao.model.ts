export interface Transacao {
  id?: number;
  tipo: 'entrada' | 'saida';
  categoria: string;
  valor: number;
  descricao?: string;
  dataHora?: string;
  alunoId?: number;
}