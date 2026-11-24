import axios from 'axios';
import Constants from 'expo-constants';

import { MovimentacaoRequest, Produto, ProdutoRequest } from '@/models/Produto';

// Em desenvolvimento, usa o mesmo IP do servidor do Expo para o celular acessar o backend.
const devHost = Constants.expoConfig?.hostUri?.split(':')[0];
const host = devHost && devHost !== 'localhost' ? devHost : 'localhost';

export const API_URL = `http://${host}:8080/api/produtos`;

export async function getProdutos(categoria?: string): Promise<Produto[]> {
  const url = categoria ? `${API_URL}?categoria=${encodeURIComponent(categoria)}` : API_URL;
  const response = await axios.get<Produto[]>(url);
  return response.data;
}

export async function getProduto(id: number): Promise<Produto> {
  const response = await axios.get<Produto>(`${API_URL}/${id}`);
  return response.data;
}

export async function createProduto(produto: ProdutoRequest): Promise<Produto> {
  const response = await axios.post<Produto>(API_URL, produto);
  return response.data;
}

export async function updateProduto(id: number, produto: ProdutoRequest): Promise<Produto> {
  const response = await axios.put<Produto>(`${API_URL}/${id}`, produto);
  return response.data;
}

export async function movimentarProduto(
  id: number,
  movimentacao: MovimentacaoRequest,
): Promise<Produto> {
  const response = await axios.patch<Produto>(`${API_URL}/${id}/movimentacao`, movimentacao);
  return response.data;
}

export async function deleteProduto(id: number): Promise<void> {
  await axios.delete(`${API_URL}/${id}`);
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;

    if (data?.message) {
      return data.message;
    }

    if (!error.response) {
      return 'Não foi possível conectar à API. Verifique se o backend está rodando.';
    }
  }

  return fallback;
}
