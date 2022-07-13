import React from 'react';
import styles from './Descricao.module.css';

export default function Descricao() {
  return (
    <nav className={styles.container}>
      <div className={styles.containerDescricao}>
        <h1 className={styles.descricaoTitulo}>
          Encontre hashtags de maneira fácil
        </h1>
        <h2 className={styles.descricaoSubtitulo}>
          Digite o que deseja no campo de buscas e confira os resultados do
          Twitter abaixo
        </h2>
      </div>
    </nav>
  );
}
