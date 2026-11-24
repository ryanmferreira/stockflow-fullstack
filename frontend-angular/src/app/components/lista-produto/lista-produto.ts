import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Produto } from '../../models/produto.model';

@Component({
  selector: 'lista-produto-list',
  templateUrl: './lista-produto.html',
  styleUrl: './lista-produto.scss',
})
export class ListaProduto {
  @Input() produtos: Produto[] = [];
  @Input() selectedId: number | null = null;
  @Input() loading = false;
  @Input() filter = '';

  @Output() select = new EventEmitter<Produto>();
  @Output() filterChange = new EventEmitter<string>();
  @Output() create = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  isEstoqueBaixo(produto: Produto): boolean {
    return produto.quantidade <= produto.estoqueMinimo;
  }

  onFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filterChange.emit(select.value);
  }
}