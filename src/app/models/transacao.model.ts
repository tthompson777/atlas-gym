export interface Transacao {
  id?: number;
  tipo: 'Entrada' | 'Saida';
  categoria: string;
  valor: number;
  descricao?: string;
  dataHora?: string;
  alunoId?: number;
}