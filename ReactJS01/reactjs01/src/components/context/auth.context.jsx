import { createContext } from 'react';

export const AuthContext = createContext({
  isAuthenticated: false,
  user: {
    email: "",
    name: "",
    role: "",
    _id: "",
  },
  appLoading: true,
});
