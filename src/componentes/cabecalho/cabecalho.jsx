import React from 'react';
import styles from './Cabecalho.module.css';
import BotaoSobre from '../botoes/botaoSobre';
import BotaoLogin from '../botoes/botaoLogin';
import { Link } from 'react-router-dom';

export default function Cabecalho({ acao }) {
 
  return (
    <header className={acao ? styles.ativaCabecalho : styles.container}>
      <div className={styles.containerCabecalho}>
        <div className={styles.cabecalhoTitulo}>
          <Link
            to='/'
            text='Link para Home'
            className='linkHome'
            style={{ textDecoration: 'none' }}>
            <span>hashtag</span>
            <span className={styles.tituloNegrito}>finder</span>
          </Link>
        </div>

        <div className={styles.containerCabecalhoBotoes}>
          <BotaoSobre pagina={'Sobre'} />
          <BotaoLogin pagina={'Login'} />
        </div>
      </div>
    </header>
  );
}
