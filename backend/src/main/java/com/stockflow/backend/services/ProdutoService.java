package com.stockflow.backend.services;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.stockflow.backend.dtos.MovimentacaoRequest;
import com.stockflow.backend.dtos.ProdutoRequest;
import com.stockflow.backend.dtos.ProdutoResponse;
import com.stockflow.backend.entities.Produto;
import com.stockflow.backend.mappers.ProdutoMapper;
import com.stockflow.backend.repositories.ProdutoRepository;

@Service
public class ProdutoService {
    private static final String TIPO_ENTRADA = "ENTRADA";
    private static final String TIPO_SAIDA = "SAIDA";

    private final ProdutoRepository repository;

    ProdutoService(ProdutoRepository repository) {
        this.repository = repository;
    }

    public List<ProdutoResponse> findAll(String categoria) {
        List<Produto> produtos;

        if (categoria == null || categoria.isBlank()) {
            produtos = repository.findAll();
        } else {
            produtos = repository.findByCategoriaIgnoreCase(categoria.trim());
        }

        return produtos.stream().map(ProdutoMapper::toDTO).toList();
    }

    public ProdutoResponse findById(Long id) {
        Produto produto = repository.findById(id).orElse(null);

        if (produto == null) {
            return null;
        }

        return ProdutoMapper.toDTO(produto);
    }

    public ProdutoResponse save(ProdutoRequest request) {
        validate(request);

        Produto produto = ProdutoMapper.toEntity(request);
        
        produto.setNome(request.nome().trim());
        produto.setDescricao(normalizeDescricao(request.descricao()));
        produto.setCategoria(request.categoria().trim());

        return ProdutoMapper.toDTO(repository.save(produto));
    }

    public ProdutoResponse update(Long id, ProdutoRequest request) {
        Produto produto = repository.findById(id).orElse(null);

        if (produto == null) {
            return null;
        }

        validate(request);

        produto.setNome(request.nome().trim());
        produto.setDescricao(normalizeDescricao(request.descricao()));
        produto.setCategoria(request.categoria().trim());
        produto.setQuantidade(request.quantidade());
        produto.setEstoqueMinimo(request.estoqueMinimo());

        return ProdutoMapper.toDTO(repository.save(produto));
    }

    public ProdutoResponse movimentar(Long id, MovimentacaoRequest request) {
        Produto produto = repository.findById(id).orElse(null);

        if (produto == null) {
            return null;
        }

        if (request == null) {
            throw badRequest("Os dados da movimentação são obrigatórios");
        }

        String tipo = normalizeTipo(request.tipo());
        Integer quantidade = request.quantidade();

        if (quantidade == null) {
            throw badRequest("O campo quantidade é obrigatório");
        }

        if (quantidade <= 0) {
            throw badRequest("A quantidade da movimentação deve ser maior que zero");
        }

        int saldoAtual = produto.getQuantidade();

        if (TIPO_ENTRADA.equals(tipo)) {
            produto.setQuantidade(saldoAtual + quantidade);
        } else {
            if (quantidade > saldoAtual) {
                 throw badRequest("Estoque insuficiente. Saldo disponível: " + saldoAtual);
            }

            produto.setQuantidade(saldoAtual - quantidade);
        }

        return ProdutoMapper.toDTO(repository.save(produto));
    }

    public boolean deleteById(Long id) {
        if (!repository.existsById(id)) {
            return false;
        }

        repository.deleteById(id);
        return true;
    }

    private void validate(ProdutoRequest request) {
        if (request == null) {
            throw badRequest("Os dados do produto são obrigatórios");
        }

        if (request.nome() == null || request.nome().isBlank()) {
            throw badRequest("O campo nome é obrigatório");
        }

        if (request.categoria() == null || request.categoria().isBlank()) {
            throw badRequest("O campo categoria é obrigatório");
        }

        if (request.quantidade() == null) {
            throw badRequest("O campo quantidade é obrigatório");
        }

        if (request.quantidade() < 0) {
            throw badRequest("A quantidade não pode ser negativa");
        }

        if (request.estoqueMinimo() == null) {
            throw badRequest("O campo estoqueMinimo é obrigatório");
        }

        if (request.estoqueMinimo() < 0) {
            throw badRequest("O estoque mínimo não pode ser negativo");
        }
    }

    private String normalizeDescricao(String descricao) {
        if (descricao == null || descricao.isBlank()) {
            return null;
        }

        return descricao.trim();
    }

    private String normalizeTipo(String tipo) {
        if (tipo == null || tipo.isBlank()) {
            throw badRequest("O campo tipo é obrigatório");
        }

        String normalized = tipo.trim().toUpperCase();

        if (!TIPO_ENTRADA.equals(normalized) && !TIPO_SAIDA.equals(normalized)) {
            throw badRequest("Tipo inválido. Use ENTRADA ou SAIDA");
        }

        return normalized;
    }

    private ResponseStatusException badRequest(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}
