import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, computed, OnInit, signal } from '@angular/core';

import { ProdutoDetail } from './components/detalhes-produto/detalhes-produto';
import { ListaProduto } from './components/lista-produto/lista-produto';
import { DetailMode, Produto, ProdutoRequest, TipoMovimentacao } from './models/produto.model';
import { ProdutoService } from './services/produto.service';

@Component({
  selector: 'app-root',
  imports: [ListaProduto, ProdutoDetail],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  readonly produtos = signal<Produto[]>([]);
  readonly selectedProduto = signal<Produto | null>(null);
  readonly filter = signal('');
  readonly mode = signal<DetailMode>('empty');
  readonly loading = signal(false);
  readonly error = signal('');
  readonly success = signal('');

  readonly produtosFiltrados = computed(() => {
    const filtroAtual = this.filter();
    const lista = this.produtos();

    if (filtroAtual === 'ESTOQUE_BAIXO') {
      return lista.filter((p) => p.quantidade <= p.estoqueMinimo);
    }
    if (filtroAtual === 'ESTOQUE_NORMAL') {
      return lista.filter((p) => p.quantidade > p.estoqueMinimo);
    }
    return lista;
  });

  constructor(
    private service: ProdutoService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadProdutos();
  }

  loadProdutos(selectId?: number): void {
    const targetId = selectId ?? this.selectedProduto()?.id ?? null;
    this.loading.set(true);
    this.cdr.markForCheck();

    this.service.getAll().subscribe({
      next: (produtos) => {
        this.produtos.set(produtos);
        this.loading.set(false);
        this.error.set('');

        if (targetId !== null) {
          const selected = produtos.find((produto) => produto.id === targetId);
          if (selected) {
            this.selectedProduto.set(selected);
          }
        }
        this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        this.error.set(this.errorMessage(error));
        this.cdr.markForCheck();
      },
    });
  }

  refreshProdutos(): void {
    this.clearMessages();
    this.loadProdutos();
  }

  changeFilter(filtro: string): void {
    this.filter.set(filtro);
    this.selectedProduto.set(null);
    this.mode.set('empty');
    this.clearMessages();
  }

  selectProduto(produto: Produto): void {
    this.clearMessages();
    this.selectedProduto.set(produto);
    this.mode.set('view');
  }

  startCreate(): void {
    this.clearMessages();
    this.selectedProduto.set(null);
    this.mode.set('create');
  }

  startEdit(): void {
    if (this.selectedProduto()) {
      this.clearMessages();
      this.mode.set('edit');
    }
  }

  cancelEdit(): void {
    this.mode.set(this.selectedProduto() ? 'view' : 'empty');
  }

  saveProduto(request: ProdutoRequest): void {
    const current = this.selectedProduto();
    const isEditing = this.mode() === 'edit' && current !== null;
    this.clearMessages();

    const request$ = isEditing && current !== null
      ? this.service.update(current.id, request)
      : this.service.save(request);

    request$.subscribe({
      next: (saved) => {
        this.selectedProduto.set(saved);
        this.mode.set('view');
        this.success.set(
          isEditing
            ? 'Produto atualizado com sucesso.'
            : 'Produto cadastrado com sucesso.'
        );
        this.loadProdutos(saved.id);
        this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(this.errorMessage(error));
        this.cdr.markForCheck();
      },
    });
  }

  movimentarProduto(produto: Produto): void {
    this.clearMessages();

    const tipoInput = window.prompt('Informe o tipo de movimentação (ENTRADA ou SAIDA):', 'ENTRADA')?.trim().toUpperCase();

    if (!tipoInput) {
      return;
    }

    if (tipoInput !== 'ENTRADA' && tipoInput !== 'SAIDA') {
      this.error.set('Tipo inválido. Informe ENTRADA ou SAIDA.');
      return;
    }

    const qtdInput = window.prompt('Informe a quantidade (inteiro positivo):', '1');
    if (qtdInput === null) {
      return;
    }

    const quantidade = Number(qtdInput);
    if (!Number.isInteger(quantidade) || quantidade <= 0) {
      this.error.set('A quantidade deve ser um número inteiro positivo.');
      return;
    }

    if (tipoInput === 'SAIDA' && quantidade > produto.quantidade) {
      this.error.set(
        `Saída não permitida. Estoque atual (${produto.quantidade}) insuficiente.`
      );
      return;
    }

    const novaMovimentacao = {
      tipo: tipoInput as TipoMovimentacao,
      quantidade,
    }

    this.service
      .movimentarEstoque(produto.id, novaMovimentacao)
      .subscribe({
        next: (atualizado) => {
          this.selectedProduto.set(atualizado);
          this.success.set('Movimentação registrada com sucesso.');
          this.loadProdutos(atualizado.id);
          this.cdr.markForCheck();
        },
        error: (error: HttpErrorResponse) => {
          this.error.set(this.errorMessage(error));
          this.cdr.markForCheck();
        },
      });
  }

  deleteProduto(id: number): void {
    if (!window.confirm('Deseja realmente excluir este produto?')) {
      return;
    }

    this.clearMessages();

    this.service.delete(id).subscribe({
      next: () => {
        this.selectedProduto.set(null);
        this.mode.set('empty');
        this.success.set('Produto excluído com sucesso.');
        this.loadProdutos();
        this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(this.errorMessage(error));
        this.cdr.markForCheck();
      },
    });
  }

  private clearMessages(): void {
    this.error.set('');
    this.success.set('');
  }

  private errorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'Não foi possível conectar à API. Verifique se o backend está rodando em http://localhost:8080.';
    }
    return error.error?.message ?? 'Ocorreu um erro ao processar a solicitação.';
  }
}