import React, { useEffect, useState } from "react";
import Busca from "../../componentes/busca/busca";
import Cabecalho from "../../componentes/cabecalho/cabecalho";
import Descricao from "../../componentes/descricao/descricao";
import Rodape from "../../componentes/rodape/rodape";

import styles from "./Home.module.css";
import "../../css/global.css";

export default function Home() {
  const [ativaNav, setAtivaNav] = useState(false);

  /* Altera o título da aba da página */
  useEffect(() => {
    document.title = "hashtagfinder | Home";
  }, [])

  /* Ativa o cabeçalho após a posição vertical (y) 900 da página */
   useEffect(() => {
    function posicaoScroll() {
      if (window.scrollY >= 900) {
        setAtivaNav(true);
      } else {
        setAtivaNav(false);
      }
    }
    window.addEventListener("scroll", posicaoScroll);
  }, []);

  return (
    <div className={styles.home}>
      <Cabecalho acao={ativaNav} />
      <Descricao />
      <Busca type="search" placeholder="Buscar..." maxLength={20} />
      <Rodape />
    </div>
  );
};
