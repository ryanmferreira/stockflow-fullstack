import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { DetailMode, Produto, ProdutoRequest } from '../../models/produto.model';

@Component({
  selector: 'app-produto-detail',
  imports: [ReactiveFormsModule],
  templateUrl: './detalhes-produto.html',
  styleUrl: './detalhes-produto.scss',
})
export class ProdutoDetail implements OnChanges {
  @Input() produto: Produto | null = null;
  @Input() mode: DetailMode = 'empty';

  @Output() save = new EventEmitter<ProdutoRequest>();
  @Output() remove = new EventEmitter<number>();
  @Output() edit = new EventEmitter<void>();
  @Output() create = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() movimentar = new EventEmitter<Produto>();

  form = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    descricao: new FormControl(''),
    categoria: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    quantidade: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
    estoqueMinimo: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0)],
    }),
  });

  isEstoqueBaixo(produto: Produto): boolean {
    return produto.quantidade <= produto.estoqueMinimo;
  }

  ngOnChanges(): void {
    if (this.mode === 'edit' && this.produto) {
      this.form.patchValue({
        nome: this.produto.nome,
        descricao: this.produto.descricao || '',
        categoria: this.produto.categoria,
        quantidade: this.produto.quantidade,
        estoqueMinimo: this.produto.estoqueMinimo,
      });
    } else if (this.mode === 'create') {
      this.form.reset({
        nome: '',
        descricao: '',
        categoria: '',
        quantidade: 0,
        estoqueMinimo: 0,
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.save.emit({
      nome: value.nome.trim(),
      descricao: value.descricao?.trim() ? value.descricao.trim() : null,
      categoria: value.categoria.trim(),
      quantidade: Math.trunc(value.quantidade),
      estoqueMinimo: Math.trunc(value.estoqueMinimo),
    });
  }
}