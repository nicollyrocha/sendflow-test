import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import type { Auth } from "firebase/auth";

export const register = async (auth: Auth, email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const login = async (auth: Auth, email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = async (auth: Auth) => {
  return signOut(auth);
};
