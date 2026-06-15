import { Tabs } from 'expo-router';
import { Text } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1.5,
          borderTopColor: '#dde0ea',
          height: 64,
          paddingBottom: 8,
        },
        tabBarActiveTintColor: '#1e5fc2',
        tabBarInactiveTintColor: '#b0b5c8',
        tabBarLabelStyle: { fontSize: 10, fontWeight: '700' },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'HOME',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="projetos"
        options={{
          title: 'PROJETOS',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📁</Text>,
        }}
      />
      <Tabs.Screen
        name="tarefas"
        options={{
          title: 'TAREFAS',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📋</Text>,
        }}
      />
      <Tabs.Screen
        name="conta"
        options={{
          title: 'CONTA',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>,
        }}
      />
    </Tabs>
  );
}