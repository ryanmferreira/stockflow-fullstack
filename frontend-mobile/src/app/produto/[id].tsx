import { router, Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ChoiceGroup } from '@/components/ChoiceGroup';
import { MovimentacaoTipo, Produto } from '@/models/Produto';
import {
  deleteProduto,
  getApiErrorMessage,
  getProduto,
  movimentarProduto,
} from '@/services/produtoService';
import { colors, fonts } from '@/theme';

const TIPO_OPTIONS = [
  { value: 'ENTRADA', label: 'Entrada' },
  { value: 'SAIDA', label: 'Saída' },
];

export default function ProdutoDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const produtoId = Number(id);

  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [tipo, setTipo] = useState<MovimentacaoTipo>('SAIDA');
  const [quantidade, setQuantidade] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadProduto = useCallback(async () => {
    try {
      const data = await getProduto(produtoId);
      setError('');
      setProduto(data);
    } catch {
      setError('Não foi possível carregar o produto.');
    } finally {
      setLoading(false);
    }
  }, [produtoId]);

  useFocusEffect(
    useCallback(() => {
      loadProduto();
    }, [loadProduto]),
  );

  const retry = () => {
    setLoading(true);
    loadProduto();
  };

  const registrarMovimentacao = async () => {
    if (!produto) {
      return;
    }

    const valor = Number(quantidade);

    if (!Number.isInteger(valor) || valor <= 0) {
      setSuccess('');
      setError('Informe uma quantidade inteira maior que zero.');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const atualizado = await movimentarProduto(produto.id, { tipo, quantidade: valor });
      setProduto(atualizado);
      setQuantidade('');
      setSuccess(
        `${tipo === 'ENTRADA' ? 'Entrada' : 'Saída'} de ${valor} unidade(s) registrada.`,
      );
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível registrar a movimentação.'));
    } finally {
      setSaving(false);
    }
  };

  const removeProduto = async () => {
    if (!produto) {
      return;
    }

    setDeleting(true);
    setError('');

    try {
      await deleteProduto(produto.id);
      setDeleting(false);

      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/');
      }
    } catch (err) {
      setDeleting(false);
      setError(getApiErrorMessage(err, 'Não foi possível excluir o produto.'));
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: produto ? `Produto #${produto.id}` : 'Produto' }} />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.helper}>Carregando produto...</Text>
        </View>
      ) : !produto ? (
        <View style={styles.centered}>
          <Text style={styles.error}>{error || 'Produto não encontrado.'}</Text>
          <Pressable style={styles.retry} onPress={retry}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.screen}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.panel}>
              <Text style={styles.eyebrow}>Produto #{produto.id}</Text>
              <Text style={styles.title}>{produto.nome}</Text>

              <View style={styles.meta}>
                <Text style={styles.metaText}>{produto.categoria}</Text>
                <Text style={styles.separator}>-</Text>
                <Text style={[styles.metaText, produto.estoqueBaixo && styles.metaDanger]}>
                  {produto.estoqueBaixo ? 'Estoque baixo' : 'Estoque normal'}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.field}>
                <Text style={styles.label}>Categoria</Text>
                <Text style={styles.value}>{produto.categoria}</Text>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Descrição</Text>
                <Text style={styles.value}>{produto.descricao || 'Sem descrição.'}</Text>
              </View>

              <View style={styles.stockGrid}>
                <View style={[styles.stockCard, produto.estoqueBaixo && styles.stockCardDanger]}>
                  <Text style={styles.stockLabel}>Saldo atual</Text>
                  <Text style={[styles.stockValue, produto.estoqueBaixo && styles.stockValueDanger]}>
                    {produto.quantidade}
                  </Text>
                  <Text style={styles.stockUnit}>unidade(s)</Text>
                </View>

                <View style={styles.stockCard}>
                  <Text style={styles.stockLabel}>Estoque mínimo</Text>
                  <Text style={styles.stockValue}>{produto.estoqueMinimo}</Text>
                  <Text style={styles.stockUnit}>unidade(s)</Text>
                </View>
              </View>

              {produto.estoqueBaixo ? (
                <View style={styles.warningBox}>
                  <Text style={styles.warningTitle}>Estoque baixo</Text>
                  <Text style={styles.warningText}>
                    O saldo está igual ou abaixo do estoque mínimo.
                  </Text>
                </View>
              ) : null}

              <View style={styles.divider} />

              <Text style={styles.sectionTitle}>Movimentar estoque</Text>

              <ChoiceGroup
                label="Tipo de movimentação"
                options={TIPO_OPTIONS}
                value={tipo}
                onChange={(value) => setTipo(value as MovimentacaoTipo)}
                disabled={saving}
              />

              <View style={styles.field}>
                <Text style={styles.label}>Quantidade</Text>
                <TextInput
                  value={quantidade}
                  onChangeText={setQuantidade}
                  style={styles.input}
                  placeholder="Ex.: 3"
                  placeholderTextColor={colors.muted}
                  keyboardType="number-pad"
                  editable={!saving}
                />
                <Text style={styles.hint}>
                  A saída não pode deixar o saldo negativo.
                </Text>
              </View>

              {success ? <Text style={styles.success}>{success}</Text> : null}
              {error ? <Text style={styles.error}>{error}</Text> : null}

              <Pressable
                accessibilityRole="button"
                disabled={saving}
                onPress={registrarMovimentacao}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.buttonPressed,
                  saving && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.primaryButtonText}>
                  {saving
                    ? 'Registrando...'
                    : `Registrar ${tipo === 'ENTRADA' ? 'entrada' : 'saída'}`}
                </Text>
              </Pressable>

              <View style={styles.divider} />

              <View style={styles.actions}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    setConfirmingDelete(false);
                    router.push({
                      pathname: '/produto/form',
                      params: { id: String(produto.id) },
                    });
                  }}
                  style={({ pressed }) => [styles.ghostButton, pressed && styles.buttonPressed]}
                >
                  <Text style={styles.ghostButtonText}>Editar</Text>
                </Pressable>

                <Pressable
                  accessibilityRole="button"
                  onPress={() => setConfirmingDelete(true)}
                  style={({ pressed }) => [styles.dangerButton, pressed && styles.buttonPressed]}
                >
                  <Text style={styles.dangerButtonText}>Excluir</Text>
                </Pressable>
              </View>

              {confirmingDelete ? (
                <View style={styles.confirmBox}>
                  <Text style={styles.confirmTitle}>Excluir este produto?</Text>
                  <Text style={styles.confirmText}>Essa ação não pode ser desfeita.</Text>

                  <View style={styles.actions}>
                    <Pressable
                      accessibilityRole="button"
                      disabled={deleting}
                      onPress={removeProduto}
                      style={({ pressed }) => [
                        styles.dangerButton,
                        pressed && styles.buttonPressed,
                        deleting && styles.buttonDisabled,
                      ]}
                    >
                      <Text style={styles.dangerButtonText}>
                        {deleting ? 'Excluindo...' : 'Excluir'}
                      </Text>
                    </Pressable>

                    <Pressable
                      accessibilityRole="button"
                      disabled={deleting}
                      onPress={() => setConfirmingDelete(false)}
                      style={({ pressed }) => [
                        styles.ghostButton,
                        pressed && styles.buttonPressed,
                        deleting && styles.buttonDisabled,
                      ]}
                    >
                      <Text style={styles.ghostButtonText}>Cancelar</Text>
                    </Pressable>
                  </View>
                </View>
              ) : null}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
  },
  panel: {
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 6,
    backgroundColor: colors.surface,
  },
  eyebrow: {
    color: colors.muted,
    fontSize: 12,
  },
  title: {
    marginTop: 4,
    color: colors.text,
    fontFamily: fonts.serif,
    fontSize: 24,
    lineHeight: 31,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  metaText: {
    color: colors.muted,
    fontSize: 12,
  },
  metaDanger: {
    color: colors.danger,
    fontWeight: '600',
  },
  separator: {
    color: colors.borderStrong,
    fontSize: 12,
  },
  divider: {
    height: 1,
    marginVertical: 20,
    backgroundColor: colors.border,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 3,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  value: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  stockGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  stockCard: {
    flex: 1,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    backgroundColor: colors.surfaceMuted,
  },
  stockCardDanger: {
    borderColor: colors.dangerBorder,
    backgroundColor: colors.dangerSoft,
  },
  stockLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '600',
  },
  stockValue: {
    marginTop: 4,
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
  },
  stockValueDanger: {
    color: colors.danger,
  },
  stockUnit: {
    color: colors.muted,
    fontSize: 11,
  },
  warningBox: {
    gap: 4,
    marginTop: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    borderRadius: 4,
    backgroundColor: colors.dangerSoft,
  },
  warningTitle: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700',
  },
  warningText: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  sectionTitle: {
    marginBottom: 10,
    color: colors.text,
    fontFamily: fonts.serif,
    fontSize: 18,
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 4,
    backgroundColor: colors.input,
    color: colors.text,
    fontSize: 15,
  },
  hint: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 11,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  primaryButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  ghostButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 4,
  },
  ghostButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  dangerButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    borderRadius: 4,
  },
  dangerButtonText: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.75,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  success: {
    marginBottom: 12,
    color: colors.success,
    fontSize: 13,
  },
  error: {
    marginBottom: 12,
    color: colors.danger,
    fontSize: 13,
  },
  confirmBox: {
    gap: 6,
    marginTop: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    borderRadius: 4,
    backgroundColor: colors.dangerSoft,
  },
  confirmTitle: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  confirmText: {
    marginBottom: 4,
    color: colors.muted,
    fontSize: 12,
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
