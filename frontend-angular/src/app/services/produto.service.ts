import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  MovimentacaoEstoqueRequest,
  Produto,
  ProdutoRequest,
} from '../models/produto.model';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  apiUrl = 'http://localhost:8080/api/produtos';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }

  findById(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }

  save(produto: ProdutoRequest): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto);
  }

  update(id: number, produto: ProdutoRequest): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto);
  }

  movimentarEstoque(id: number, movimentacao: MovimentacaoEstoqueRequest): Observable<Produto> {
    return this.http.patch<Produto>(`${this.apiUrl}/${id}/movimentacao`,  movimentacao );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}