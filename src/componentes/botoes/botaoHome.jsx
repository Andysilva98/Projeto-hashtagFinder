import React from 'react';
import styles from './botaoRosa.module.css';
import iconeRosa from '../../imagens/icones/icon-home.svg';
import { Link } from 'react-router-dom';

export default function BotaoHome(props) {
  return (
    <div className={styles.botaoRosa}>
      <Link
        to='/'
        text='Link para Home'
        className='linkHome'
        style={{ textDecoration: 'none' }}
        >
        <button>
          <img className={styles.iconeRosa} src={iconeRosa} alt='icone botao' />
          {props.pagina}
        </button>
      </Link>
    </div>
  );
}
