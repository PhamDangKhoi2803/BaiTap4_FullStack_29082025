import { useState } from 'react';
import { AuthContext } from './auth.context';

export const AuthWrapper = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({ email: "", name: "", role: "", _id: "" });
  const [appLoading, setAppLoading] = useState(true);

  // Hàm cập nhật auth cho App.jsx
  const setAuth = ({ isAuthenticated, user }) => {
    setIsAuthenticated(isAuthenticated);
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setAuth, appLoading, setAppLoading }}>
      {props.children}
    </AuthContext.Provider>
  );
};