import { useEffect, useState } from "react";
import { auth } from "../config/firebase";
import type { User } from "firebase/auth";

interface AuthContext {
  user: User | null;
  loading: boolean;
}

export const useAuth = (): AuthContext => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
};
