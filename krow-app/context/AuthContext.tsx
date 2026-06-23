import React, { createContext, useContext, useState, ReactNode } from 'react';

type User = {
  name: string;
  email: string;
  phone: string;
  role?: string;
  avatar?: string | null;
};
type UserRecord = User & { password: string };

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, phone: string, password: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<UserRecord[]>([]);

  function register(name: string, email: string, phone: string, password: string) {
    setUsers(prev => [...prev, { name, email, phone, password }]);
  }

  function login(email: string, password: string): boolean {
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      setUser({ name: found.name, email: found.email, phone: found.phone, role: found.role, avatar: found.avatar });
      return true;
    }
    return false;
  }

  function logout() {
    setUser(null);
  }

  function updateUser(data: Partial<User>) {
    setUser(prev => (prev ? { ...prev, ...data } : prev));

    setUsers(prev =>
      prev.map(u => (u.email === user?.email ? { ...u, ...data } : u))
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);