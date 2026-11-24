import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme';

type Choice = {
  value: string;
  label: string;
  color?: string;
};

type ChoiceGroupProps = {
  label: string;
  options: Choice[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function ChoiceGroup({ label, options, value, onChange, disabled }: ChoiceGroupProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.options}>
        {options.map((option) => {
          const active = option.value === value;

          return (
            <Pressable
              key={option.value}
              accessibilityRole="button"
              accessibilityState={{ selected: active, disabled }}
              disabled={disabled}
              onPress={() => onChange(option.value)}
              style={[styles.option, active && styles.optionActive]}
            >
              <Text style={[styles.optionText, active && styles.optionTextActive]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    backgroundColor: colors.surface,
  },
  optionActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  optionText: {
    color: colors.text,
    fontSize: 13,
  },
  optionTextActive: {
    color: colors.accent,
    fontWeight: '600',
  },
});
