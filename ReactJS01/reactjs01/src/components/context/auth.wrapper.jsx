import { useState } from 'react';
import { AuthContext } from './auth.context';

export const AuthWrapper = (props) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: { email: "", name: "" }
  });
  const [appLoading, setAppLoading] = useState(true);

  return (
    <AuthContext.Provider value={{ auth, setAuth, appLoading, setAppLoading }}>
      {props.children}
    </AuthContext.Provider>
  );
};