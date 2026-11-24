export type MovimentacaoTipo = 'ENTRADA' | 'SAIDA';

export type Produto = {
  id: number;
  nome: string;
  descricao: string | null;
  categoria: string;
  quantidade: number;
  estoqueMinimo: number;
  estoqueBaixo: boolean;
};

export type ProdutoRequest = Omit<Produto, 'id' | 'estoqueBaixo'>;

export type MovimentacaoRequest = {
  tipo: MovimentacaoTipo;
  quantidade: number;
};
