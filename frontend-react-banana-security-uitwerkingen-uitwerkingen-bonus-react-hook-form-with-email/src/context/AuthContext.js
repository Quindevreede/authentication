import React, { createContext, useState } from 'react';
import { useHistory } from 'react-router-dom';

export const AuthContext = createContext({});

function AuthContextProvider({ children }) {
  const [isAuth, toggleIsAuth] = useState({
    isAuth: false,
    user: '',
  });
  const history = useHistory();

  function login(email) {
    console.log('Gebruiker is ingelogd!');
    toggleIsAuth({
      isAuth: true,
      user: email,
    });
    history.push('/profile');
  }

  function logout() {
    console.log('Gebruiker is uitgelogd!');
    toggleIsAuth({
      isAuth: false,
      user: '',
    });
    history.push('/');
  }

  const contextData = {
    isAuth: isAuth.isAuth,
    user: isAuth.user,
    login: login,
    logout: logout,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;