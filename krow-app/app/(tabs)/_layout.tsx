import { Tabs } from "expo-router";
import { Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: "shift",
        tabBarStyle: {
          backgroundColor: "#e3e4e9",
          borderTopWidth: 0,
          height: 75,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#7a8099",
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700" },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "HOME",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>🏠</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="projetos"
        options={{
          title: "PROJETOS",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>📁</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="tarefas"
        options={{
          title: "TAREFAS",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, color }}>📋</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="conta"
        options={{
          title: "CONTA",
          tabBarIcon: ({ color }) => (
            <FontAwesome5 name="user-tie" size={20} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          tabBarItemStyle: {
            display: "none",
          },
        }}
      />
    </Tabs>
  );
}
