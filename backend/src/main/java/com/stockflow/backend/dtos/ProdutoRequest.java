package com.stockflow.backend.dtos;

public record ProdutoRequest(String nome, String descricao, String categoria, Integer quantidade, Integer estoqueMinimo) { }
