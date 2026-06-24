import { Stack } from 'expo-router';

export default function ContaLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="editar" />
    </Stack>
  );
}