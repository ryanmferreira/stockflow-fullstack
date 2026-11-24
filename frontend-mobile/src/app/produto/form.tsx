import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
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

import { ProdutoRequest } from '@/models/Produto';
import {
  createProduto,
  deleteProduto,
  getApiErrorMessage,
  getProduto,
  updateProduto,
} from '@/services/produtoService';
import { colors, fonts } from '@/theme';

type FieldErrors = {
  nome?: string;
  categoria?: string;
  quantidade?: string;
  estoqueMinimo?: string;
};

export default function ProdutoForm() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const produtoId = id ? Number(id) : null;
  const isEditing = produtoId != null;

  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [estoqueMinimo, setEstoqueMinimo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (produtoId == null) {
      return;
    }

    let active = true;

    getProduto(produtoId)
      .then((produto) => {
        if (!active) return;
        setNome(produto.nome);
        setCategoria(produto.categoria);
        setQuantidade(String(produto.quantidade));
        setEstoqueMinimo(String(produto.estoqueMinimo));
        setDescricao(produto.descricao ?? '');
        setLoadError('');
      })
      .catch(() => {
        if (active) setLoadError('Não foi possível carregar o produto.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [produtoId, reloadKey]);

  const retry = () => {
    setLoading(true);
    setLoadError('');
    setReloadKey((key) => key + 1);
  };

  const submit = async () => {
    const nextErrors: FieldErrors = {};
    const quantidadeNumero = Number(quantidade);
    const estoqueNumero = Number(estoqueMinimo);

    if (!nome.trim()) {
      nextErrors.nome = 'O nome é obrigatório.';
    }

    if (!categoria.trim()) {
      nextErrors.categoria = 'A categoria é obrigatória.';
    }

    if (!quantidade.trim() || !Number.isInteger(quantidadeNumero) || quantidadeNumero < 0) {
      nextErrors.quantidade = 'Informe um número inteiro maior ou igual a zero.';
    }

    if (
      !estoqueMinimo.trim() ||
      !Number.isInteger(estoqueNumero) ||
      estoqueNumero < 0
    ) {
      nextErrors.estoqueMinimo = 'Informe um número inteiro maior ou igual a zero.';
    }

    setFieldErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSaving(true);
    setError('');

    const payload: ProdutoRequest = {
      nome: nome.trim(),
      descricao: descricao.trim() || null,
      categoria: categoria.trim(),
      quantidade: quantidadeNumero,
      estoqueMinimo: estoqueNumero,
    };

    try {
      if (produtoId != null) {
        await updateProduto(produtoId, payload);
        setSaving(false);
        router.back();
      } else {
        const saved = await createProduto(payload);
        setSaving(false);
        router.replace({ pathname: '/produto/[id]', params: { id: String(saved.id) } });
      }
    } catch (err) {
      setSaving(false);
      setError(
        getApiErrorMessage(err, 'Não foi possível salvar o produto. Verifique os campos e o backend.'),
      );
    }
  };

  const remove = async () => {
    if (produtoId == null) {
      return;
    }

    setDeleting(true);
    setError('');

    try {
      await deleteProduto(produtoId);
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

  const cancel = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.helper}>Carregando produto...</Text>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{loadError}</Text>
        <Pressable style={styles.ghostButton} onPress={retry}>
          <Text style={styles.ghostButtonText}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: isEditing ? 'Editar produto' : 'Novo produto' }} />

      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.panel}>
            <Text style={styles.eyebrow}>
              {isEditing ? `Editando produto #${produtoId}` : 'Novo produto'}
            </Text>
            <Text style={styles.title}>{isEditing ? 'Editar produto' : 'Cadastrar produto'}</Text>

            <View style={styles.divider} />

            <View style={styles.field}>
              <Text style={styles.label}>Nome *</Text>
              <TextInput
                value={nome}
                onChangeText={setNome}
                style={[styles.input, fieldErrors.nome ? styles.inputError : null]}
                placeholder="Ex.: Caderno"
                placeholderTextColor={colors.muted}
                editable={!saving}
                returnKeyType="next"
              />
              {fieldErrors.nome ? (
                <Text style={styles.errorText}>{fieldErrors.nome}</Text>
              ) : null}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Categoria *</Text>
              <TextInput
                value={categoria}
                onChangeText={setCategoria}
                style={[styles.input, fieldErrors.categoria ? styles.inputError : null]}
                placeholder="Ex.: Papelaria"
                placeholderTextColor={colors.muted}
                editable={!saving}
              />
              {fieldErrors.categoria ? (
                <Text style={styles.errorText}>{fieldErrors.categoria}</Text>
              ) : null}
            </View>

            <View style={styles.row}>
              <View style={styles.rowField}>
                <Text style={styles.label}>Quantidade *</Text>
                <TextInput
                  value={quantidade}
                  onChangeText={setQuantidade}
                  style={[styles.input, fieldErrors.quantidade ? styles.inputError : null]}
                  placeholder="0"
                  placeholderTextColor={colors.muted}
                  keyboardType="number-pad"
                  editable={!saving}
                />
                {fieldErrors.quantidade ? (
                  <Text style={styles.errorText}>{fieldErrors.quantidade}</Text>
                ) : null}
              </View>

              <View style={styles.rowField}>
                <Text style={styles.label}>Estoque mínimo *</Text>
                <TextInput
                  value={estoqueMinimo}
                  onChangeText={setEstoqueMinimo}
                  style={[styles.input, fieldErrors.estoqueMinimo ? styles.inputError : null]}
                  placeholder="0"
                  placeholderTextColor={colors.muted}
                  keyboardType="number-pad"
                  editable={!saving}
                />
                {fieldErrors.estoqueMinimo ? (
                  <Text style={styles.errorText}>{fieldErrors.estoqueMinimo}</Text>
                ) : null}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                value={descricao}
                onChangeText={setDescricao}
                style={[styles.input, styles.textArea]}
                placeholder="Detalhes opcionais do produto"
                placeholderTextColor={colors.muted}
                editable={!saving}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                disabled={saving}
                onPress={submit}
                style={({ pressed }) => [
                  styles.primaryButton,
                  pressed && styles.buttonPressed,
                  saving && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.primaryButtonText}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                disabled={saving}
                onPress={cancel}
                style={({ pressed }) => [
                  styles.ghostButton,
                  pressed && styles.buttonPressed,
                  saving && styles.buttonDisabled,
                ]}
              >
                <Text style={styles.ghostButtonText}>Cancelar</Text>
              </Pressable>
            </View>

            {isEditing ? (
              <>
                <View style={styles.divider} />

                {confirmDelete ? (
                  <View style={styles.confirmBox}>
                    <Text style={styles.confirmTitle}>Excluir este produto?</Text>
                    <Text style={styles.confirmText}>Essa ação não pode ser desfeita.</Text>

                    <View style={styles.actions}>
                      <Pressable
                        accessibilityRole="button"
                        disabled={deleting}
                        onPress={remove}
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
                        onPress={() => setConfirmDelete(false)}
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
                ) : (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => setConfirmDelete(true)}
                    style={({ pressed }) => [
                      styles.dangerButton,
                      pressed && styles.buttonPressed,
                    ]}
                  >
                    <Text style={styles.dangerButtonText}>Excluir produto</Text>
                  </Pressable>
                )}
              </>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  divider: {
    height: 1,
    marginVertical: 20,
    backgroundColor: colors.border,
  },
  field: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rowField: {
    flex: 1,
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
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
  inputError: {
    borderColor: colors.danger,
  },
  textArea: {
    minHeight: 90,
    paddingTop: 10,
  },
  errorText: {
    marginTop: 4,
    color: colors.danger,
    fontSize: 12,
  },
  error: {
    marginBottom: 12,
    color: colors.danger,
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  primaryButton: {
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
    alignSelf: 'flex-start',
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
  confirmBox: {
    gap: 6,
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
});
