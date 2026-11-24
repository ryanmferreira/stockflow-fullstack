import { router, useFocusEffect } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ProdutoCard } from '@/components/ProdutoCard';
import { Produto } from '@/models/Produto';
import { getProdutos } from '@/services/produtoService';
import { colors, fonts } from '@/theme';

const LOW_STOCK_FILTER = '__ESTOQUE_BAIXO__';

export default function Index() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadProdutos = useCallback(async () => {
    try {
      setError('');
      const data = await getProdutos();
      setProdutos(data);
    } catch {
      setError('Não foi possível conectar à API. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProdutos();
    }, [loadProdutos]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadProdutos();
  };

  const filterOptions = useMemo(() => {
    const categorias = Array.from(new Set(produtos.map((produto) => produto.categoria)));

    return [
      { value: '', label: 'Todos' },
      { value: LOW_STOCK_FILTER, label: 'Estoque baixo' },
      ...categorias.map((categoria) => ({ value: categoria, label: categoria })),
    ];
  }, [produtos]);

  const produtosFiltrados = useMemo(() => {
    if (!filter) {
      return produtos;
    }

    if (filter === LOW_STOCK_FILTER) {
      return produtos.filter((produto) => produto.estoqueBaixo);
    }

    return produtos.filter((produto) => produto.categoria === filter);
  }, [filter, produtos]);

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.helper}>Carregando produtos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        <View style={styles.panelHeader}>
          <Text style={styles.heading}>Produtos</Text>

          <View style={styles.headerActions}>
            <Text style={styles.count}>
              {produtosFiltrados.length}{' '}
              {produtosFiltrados.length === 1 ? 'produto' : 'produtos'}
            </Text>

            <Pressable onPress={() => loadProdutos()}>
              <Text style={styles.refreshText}>Atualizar</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => router.push('/produto/form')}
              style={({ pressed }) => [styles.newButton, pressed && styles.newButtonPressed]}
            >
              <Text style={styles.newButtonText}>Novo produto</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.filterWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterBar}
          >
            {filterOptions.map((item) => {
              const active = filter === item.value;

              return (
                <Pressable
                  key={item.value || 'todos'}
                  onPress={() => setFilter(item.value)}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                >
                  <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable style={styles.retry} onPress={() => loadProdutos()}>
              <Text style={styles.retryText}>Tentar novamente</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={produtosFiltrados}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => <ProdutoCard produto={item} />}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
            contentContainerStyle={produtosFiltrados.length === 0 ? styles.emptyContent : undefined}
            ListEmptyComponent={
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>Nenhum produto encontrado.</Text>
                <Pressable onPress={() => router.push('/produto/form')} style={styles.emptyButton}>
                  <Text style={styles.emptyButtonText}>Cadastrar produto</Text>
                </Pressable>
              </View>
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={colors.accent}
                colors={[colors.accent]}
              />
            }
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  panel: {
    flex: 1,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    backgroundColor: colors.surface,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  heading: {
    fontFamily: fonts.serif,
    fontSize: 21,
    color: colors.text,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  count: {
    color: colors.muted,
    fontSize: 12,
  },
  refreshText: {
    color: colors.muted,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  newButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  newButtonPressed: {
    opacity: 0.8,
  },
  newButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  filterWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  filterBar: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceMuted,
  },
  filterChipActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  filterChipText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: colors.accent,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyBox: {
    alignItems: 'center',
    gap: 12,
    padding: 24,
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    textAlign: 'center',
  },
  emptyButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 24,
    backgroundColor: colors.background,
  },
  helper: {
    color: colors.muted,
    fontSize: 14,
  },
  errorBox: {
    alignItems: 'center',
    gap: 12,
    padding: 24,
  },
  errorText: {
    color: colors.danger,
    fontSize: 14,
    textAlign: 'center',
  },
  retry: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 4,
  },
  retryText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
});
