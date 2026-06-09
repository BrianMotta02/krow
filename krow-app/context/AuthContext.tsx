import React, { createContext, useContext, useState, ReactNode } from 'react';

type User = { name: string; email: string; phone: string };
type UserRecord = User & { password: string };

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, phone: string, password: string) => void;
  logout: () => void;
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
      setUser({ name: found.name, email: found.email, phone: found.phone });
      return true;
    }
    return false;
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);