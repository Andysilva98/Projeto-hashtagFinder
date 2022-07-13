import React, { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";

const ContextoDeAutenticacao = createContext({});

export const ProvedorDeAutenticacao = ({ children }) => {
  const [estaLogado, setEstaLogado] = useState();

  const login = (estaLogado) => {
    localStorage.setItem("Login", true);
    setEstaLogado(estaLogado);
  };

  const logout = () => {
    localStorage.clear();
    setEstaLogado(null);
  };

  return (
    <ContextoDeAutenticacao.Provider value={{ estaLogado, login, logout }}>
      {children}
    </ContextoDeAutenticacao.Provider>
  );
};

export const UsarAutenticacao = () => {
  return useContext(ContextoDeAutenticacao);
};
