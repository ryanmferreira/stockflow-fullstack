package com.stockflow.backend.mappers;

import com.stockflow.backend.dtos.ProdutoRequest;
import com.stockflow.backend.dtos.ProdutoResponse;
import com.stockflow.backend.entities.Produto;

public class ProdutoMapper {
    public static Produto toEntity(ProdutoRequest request) {
        Produto produto = new Produto();
     
        produto.setNome(request.nome());
        produto.setDescricao(request.descricao());
        produto.setCategoria(request.categoria());
        produto.setQuantidade(request.quantidade());
        produto.setEstoqueMinimo(request.estoqueMinimo());

        return produto;
    }

    public static ProdutoResponse toDTO(Produto produto) {
        return new ProdutoResponse(produto.getId(), produto.getNome(), produto.getDescricao(), produto.getCategoria(), produto.getQuantidade(), produto.getEstoqueMinimo(), produto.getQuantidade() <= produto.getEstoqueMinimo());
    }
}
