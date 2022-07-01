import React, { useEffect, useState } from 'react';
import styles from './Busca.module.css';
import IconeBusca from '../../imagens/icones/icon-search.svg';

import { getTweets } from '../../api/GETTweets';
import { getTweetImgs } from '../../api/GETTweetImages';

import Loader from '../../componentes/loader/Loader';
import Twitter from '../twitter/twitter';
import { motion } from 'framer-motion';

export default function Busca(props) {
  const [searchValue, setSearchValue] = useState(''); //field value
  const [searchResponse, setSearchResponse] = useState(''); //search answer
  const [tweets, setTweets] = useState(null);
  const [tweetImgs, setTweetImgs] = useState(null);
  const [moreRequest, setMoreRequest] = useState(10);
  const [titleTag, setTitleTag] = useState();
  const [imageActive, setImageActive] = useState({});
  const [resultsNumber, setResultsNumber] = useState(0);
  const [loading, setLoading] = useState(false);
  const [animationMode, setAnimationMode] = useState(0);

  useEffect(() => {
    if (searchValue) {
      asyncCall();
      return () => {
        if (tweets) {
        }
        setSearchResponse('');
        setSearchValue('');
      };
    }
  });

  const handleValue = (e) => {
    if (e.keyCode === 13) {
      setSearchValue(
        e.target.value.replace(/[^a-zA-Z0-9_]/g, '').replace(' ', '')
      );

      setSearchResponse(<Loader />);
      setResultsNumber(10);
      setMoreRequest(10);

      if (e.target.value === '') {
        setSearchResponse('É necessário digitar algo no campo de buscas...');
        setSearchValue('');
      }
    }

    if (e.keyCode === 8) {
      setSearchResponse('');
      setSearchValue('');
      setTitleTag('');
      setResultsNumber(0);
    }

    if (e.target.value.length >= 20) {
      setSearchResponse('Limite de caracteres atingido 🚨.');
    }
  };

  const asyncCall = () => {
    getTweets(searchValue, moreRequest)
      .then((tweetCall) => {
        const tweetSet = tweetCall.data.map((tweet) => {
          const user = tweetCall.includes.users.find(
            (user) => tweet.author_id === user.id
          );
          return {
            id: tweet.id,
            text: tweet.text,
            username: user.username,
            user: user.name,
            photo: user.profile_image_url,
          };
        });

        setImageActive(false);

        setTweets(tweetSet);

        getTweetImgs(searchValue, moreRequest).then((tweetImgs) => {
          const imgSet = tweetImgs.data.map((tweet) => {
            const user = tweetImgs.includes.users.find(
              (user) => tweet.author_id === user.id
            );
            const img = tweetImgs.includes.media.find(
              (img) => tweet.attachments.media_keys[0] === img.media_key
            );

            return {
              id: tweet.id,
              img: img.url,
              username: user.username,
              user: user.name,
            };
          });

          setTweetImgs(imgSet);
          setTitleTag(searchValue);
          setMoreRequest(moreRequest + 10);
        });
      })
      .catch(() => {
        setSearchResponse('Nenhum tweet foi achado, tente novamente... 😭');
        setTweets();
      });
  };

  return (
    <section className={styles.container}>
      <div className={styles.containerCampoBusca}>
        <div className={styles.campoBusca}>
          <img
            className={styles.campoBuscaIcone}
            src={IconeBusca}
            onClick={() => {
              setSearchResponse(<Loader />);
              setMoreRequest(10);
              setSearchValue(
                document
                  .getElementById('input')
                  .value.replace(/[^a-zA-Z0-9_]/g, '')
                  .replace(' ', '')
              );
              if (!document.getElementById('input').value.length) {
                setSearchResponse(
                  'É necessario digitar algo no campo de buscas... ⚠️'
                );
                console.log('teste');
                setSearchValue('');
              }
            }}
            alt='icone busca'
          />
          <input
            id='input'
            className={styles.campoBuscaInput}
            type={props.type}
            placeholder={props.placeholder}
            onKeyDown={handleValue}
            maxLength={props.maxLength}
          />
        </div>
      </div>

      <div className={styles.container}>
        {tweets?.map(({ user, username, text, id, photo }) => {
          return (
            <Twitter
              userImage={photo}
              user={user}
              userName={username}
              tweetText={text}
              tweetId={id}
              key={id}
            />
          );
        })}
      </div>

      <div className={styles.container}>
        {searchResponse ? (
          <>
            <motion.div
              initial={{ y: animationMode, opacity: 0 }}
              animate={{ y: animationMode, opacity: 1 }}
              onClick={() => setAnimationMode(animationMode)}
              transition={{ duration: 0.5, delay: 0.4 }}>
              <div className={tweets ? styles.bgResponse : styles.bgLoader}>
                <div className={styles.textResponse}>{searchResponse}</div>
              </div>
            </motion.div>
          </>
        ) : null}
      </div>

      <div className={styles.container}>
        {loading ? (
          <motion.div
            initial={{ y: animationMode, opacity: 1 }}
            animate={{ y: animationMode, opacity: 0 }}
            onClick={() => setAnimationMode(animationMode)}
            transition={{ duration: 0.7, delay: 0.4 }}
            className={styles.bgLoader}>
            <Loader />
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
