import { Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { ProjectProvider } from '../context/ProjectContext';
import { TaskProvider } from '../context/TaskContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <TaskProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </TaskProvider>
      </ProjectProvider>
    </AuthProvider>
  );
}