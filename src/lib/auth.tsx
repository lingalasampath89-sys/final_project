import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    display_name?: string;
    avatar_url?: string;
  };
}

export interface Session {
  access_token: string;
  user: User;
}

interface AuthCtx {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (user: User) => void;
}

const AuthContext = createContext<AuthCtx>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => { },
  signIn: () => { }
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for an existing session
    const storedUser = localStorage.getItem("mock_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
        setSession({ access_token: "mock_token", user: parsedUser });
      } catch (e) {
        console.error("Failed to parse mock user", e);
      }
    }
    setLoading(false);
  }, []);

  const signIn = (newUser: User) => {
    setUser(newUser);
    setSession({ access_token: "mock_token", user: newUser });
    localStorage.setItem("mock_user", JSON.stringify(newUser));
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    localStorage.removeItem("mock_user");
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut, signIn }}>
      {children}
    </AuthContext.Provider>
  );
};
