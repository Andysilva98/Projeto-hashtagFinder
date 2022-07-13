import React from 'react';
import styles from './Rodape.module.css';

export default function Rodape() {
  return (
    <footer className={styles.container}>
      <div className={styles.containerRodape}>
        <div className={styles.Rodape}>
          <p>&copy;Newtab Academy 2022. Todos os direitos reservados</p>
        </div>
      </div>
    </footer>
  );
}
