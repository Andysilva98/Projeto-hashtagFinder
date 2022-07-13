import React from 'react';
import styles from './botaoRosa.module.css';
import iconeRosa from '../../imagens/icones/icon-info-circle.svg';
import { Link } from 'react-router-dom';

export default function BotaoSobre(props) {
  return (
    <div className={styles.botaoRosa}>
      <Link
        to='/sobre'
        text='Link para Sobre'
        className='linkSobre'
        style={{ textDecoration: 'none' }}>
        <button>
          <img className={styles.iconeRosa} src={iconeRosa} alt='icone botao' />
          {props.pagina}
        </button>
      </Link>
    </div>
  );
}
