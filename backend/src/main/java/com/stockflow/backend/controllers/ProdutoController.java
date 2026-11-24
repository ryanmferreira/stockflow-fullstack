package com.stockflow.backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.stockflow.backend.dtos.MovimentacaoRequest;
import com.stockflow.backend.dtos.ProdutoRequest;
import com.stockflow.backend.dtos.ProdutoResponse;
import com.stockflow.backend.services.ProdutoService;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    private final ProdutoService service;

    public ProdutoController(ProdutoService service) {
        this.service = service;
    }

    // GET /api/produtos
    @GetMapping
    public List<ProdutoResponse> getAllProdutos(@RequestParam(required = false) String categoria) {
        return service.findAll(categoria);
    }

    // GET /api/produtos/{id}
    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponse> getProdutoById(@PathVariable Long id) {
        ProdutoResponse produto = service.findById(id);

        if (produto != null) {
            return ResponseEntity.ok(produto);
        }

        return ResponseEntity.notFound().build();
    }

    // POST /api/produtos
    @PostMapping
    public ResponseEntity<ProdutoResponse> createProduto(@RequestBody ProdutoRequest produto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(produto));
    }

    // PUT /api/produtos/{id}
    @PutMapping("/{id}")
    public ResponseEntity<ProdutoResponse> updateProduto(@PathVariable Long id, @RequestBody ProdutoRequest produto) {
        ProdutoResponse updatedProduto = service.update(id, produto);

        if (updatedProduto == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedProduto);
    }

    // PATCH /api/produtos/{id}/movimentacao
    @PatchMapping("/{id}/movimentacao")
    public ResponseEntity<ProdutoResponse> movimentarProduto(@PathVariable Long id, @RequestBody MovimentacaoRequest movimentacao) {
        ProdutoResponse updatedProduto = service.movimentar(id, movimentacao);

        if (updatedProduto == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedProduto);
    }

    // DELETE /api/produtos/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProdutoById(@PathVariable Long id) {
        if (!service.deleteById(id)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}
