import React from "react";
import styles2 from "./login.module.css";
import Formulario from "../../componentes/formulario-login/formulario";
import CabecalhoLogin from "../../componentes/cabecalho-login/cabecalhoLogin";

export default function Login() {
  return (
    <div className={styles2.fundoLogin}>
      <CabecalhoLogin />
      <Formulario />
    </div>
  );
}
