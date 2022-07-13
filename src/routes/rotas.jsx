import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../paginas/home/home";
import Login from "../paginas/login/login";
import Sobre from "../paginas/sobre/sobre";
import Lista from "../paginas/lista/Lista";
import { ProvedorDeAutenticacao } from "../providers/autenticar";
import { ChecarLogin } from "../contexts/checarLogin";
import { ExigirLogin } from "../contexts/exigirLogin";

const Rotas = () => {
  return (
    <ProvedorDeAutenticacao>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/sobre" element={<Sobre />} />
          <Route
            exact
            path="/login"
            element={
              <ChecarLogin>
                <Login />
              </ChecarLogin>
            }
          />
          <Route
            exact
            path="/lista"
            element={
              <ExigirLogin>
                <Lista />
              </ExigirLogin>
            }
          />
        </Routes>
      </BrowserRouter>
    </ProvedorDeAutenticacao>
  );
};
export default Rotas;
