package com.stockflow.backend.dtos;

public record ProdutoResponse(Long id, String nome, String descricao, String categoria, Integer quantidade, Integer estoqueMinimo, boolean estoqueBaixo) { }
