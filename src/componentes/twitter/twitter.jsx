import React from 'react';
import styles from './Twitter.module.css';

const Twitter = ({ userImage, user, userName, tweetText, tweetId }) => {
  return (
    /* <section className={`${styles.container} ${styles.TwitterFlex}`}> */
    <div className={styles.containerTwitter}>
      <div className={styles.twitter}>
        <div className={styles.containerTwitterFoto}>
          <img
            className={styles.twitterFoto}
            src={userImage}
            alt='foto perfil'
          />
        </div>

        <div className={styles.containerTwitterDescricao}>
          <div className={styles.containerTwitterNomeUsuario}>
            <span className={styles.twitterNome}>{user}</span>
            <span>
              <a
                className={styles.twitterUsuario}
                href={`https://twitter.com/${userName}`}
                target='_blank'
                rel='noreferrer'>
                @{userName}
              </a>
            </span>
          </div>
          <p className={styles.twitterDescricao}>{tweetText}</p>
          <a
            href={`https://twitter.com/${userName}/status/${tweetId}`}
            target='_blank'
            rel='noreferrer'>
            <span className={styles.twitterLink}>Ver mais no Twitter</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Twitter;
