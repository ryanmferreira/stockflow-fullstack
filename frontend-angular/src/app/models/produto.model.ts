export type TipoMovimentacao = 'ENTRADA' | 'SAIDA';

export type DetailMode = 'empty' | 'view' | 'create' | 'edit';

export interface Produto {
  id: number;
  nome: string;
  descricao: string | null;
  categoria: string;
  quantidade: number;
  estoqueMinimo: number;
}

export interface ProdutoRequest {
  nome: string; 
  descricao: string | null;
  categoria: string;
  quantidade: number;
  estoqueMinimo: number;
}

export interface MovimentacaoEstoqueRequest {
  tipo: TipoMovimentacao;
  quantidade: number;
}