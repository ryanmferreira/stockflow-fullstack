import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Produto } from '@/models/Produto';
import { colors } from '@/theme';

type ProdutoCardProps = {
  produto: Produto;
};

export function ProdutoCard({ produto }: ProdutoCardProps) {
  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: '/produto/[id]', params: { id: String(produto.id) } })
      }
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={1}>
          {produto.nome}
        </Text>

        {produto.estoqueBaixo ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Estoque baixo</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.category}>{produto.categoria}</Text>

      <View style={styles.meta}>
        <Text style={styles.metaText}>
          Saldo: <Text style={styles.metaStrong}>{produto.quantidade}</Text>
        </Text>
        <Text style={styles.separator}>-</Text>
        <Text style={styles.metaText}>Mínimo: {produto.estoqueMinimo}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    backgroundColor: colors.surface,
  },
  rowPressed: {
    backgroundColor: colors.hover,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    borderRadius: 10,
    backgroundColor: colors.dangerSoft,
  },
  badgeText: {
    color: colors.danger,
    fontSize: 10,
    fontWeight: '600',
  },
  category: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 12,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 5,
  },
  metaText: {
    color: colors.muted,
    fontSize: 12,
  },
  metaStrong: {
    color: colors.text,
    fontWeight: '600',
  },
  separator: {
    color: colors.borderStrong,
    fontSize: 12,
  },
});
