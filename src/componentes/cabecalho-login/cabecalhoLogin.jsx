import React from "react";
import styles from "../../componentes/cabecalho/Cabecalho.module.css";
import BotaoHome from "../../componentes/botoes/botaoHome";
import { Link } from "react-router-dom";

export default function CabecalhoLogin() {
  return (
    <>
      <header className={styles.container}>
        <div className={styles.containerCabecalho}>
          <div className={styles.cabecalhoTitulo}>
            <Link
              to="/"
              text="Link para Home"
              className="linkHome"
              style={{ textDecoration: "none" }}
            >
              <span>hashtag</span>
              <span className={styles.tituloNegrito}>finder</span>
            </Link>
          </div>

          <div className={styles.containerCabecalhoBotoes}>
            <BotaoHome pagina={"Home"} />
          </div>
        </div>
      </header>
    </>
  );
}
