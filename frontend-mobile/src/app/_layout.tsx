import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { colors, fonts } from '@/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontFamily: fonts.serif, fontSize: 20 },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'StockFlow' }} />
        <Stack.Screen name="produto/[id]" options={{ title: 'Produto' }} />
        <Stack.Screen name="produto/form" options={{ title: 'Produto' }} />
      </Stack>
    </>
  );
}
