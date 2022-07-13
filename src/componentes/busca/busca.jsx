import React, { useEffect, useState } from 'react';
import styles from './Busca.module.css';
import IconeBusca from '../../imagens/icones/icon-search.svg';

import { getTweets } from '../../api/GETTweets';
import { getTweetImgs } from '../../api/GETTweetImages';

import Loader from '../../componentes/loader/Loader';
import Twitter from '../twitter/twitter';
import { motion } from 'framer-motion';

import { Slider, Slide } from '../../componentes/galeria/ExportPattern';
import { settingSlider } from '../../componentes/galeria/settings';
import styles2 from '../../componentes/galeria/sliderImage.module.css';

import { airtableBuscaHashtag } from '../../api/airtableBuscaHashtag';

export default function Busca(props) {
  const [searchValue, setSearchValue] = useState('');
  const [searchResponse, setSearchResponse] = useState('');
  const [tweets, setTweets] = useState(null);
  const [tweetImgs, setTweetImgs] = useState(null);
  const [moreRequest, setMoreRequest] = useState(10);
  const [titleTag, setTitleTag] = useState();
  const [imageActive, setImageActive] = useState('');
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

  /* função callback intersectionObserver para observar e disparar um evento */
  /* semelhante ao evento addEventListener */
  /* Fica observando o scroll da página até chegar no id="sentinela" */
  useEffect(() => {
    const intersectionObserver = new IntersectionObserver((entradas) => {
      if (entradas.some((scroll) => scroll.isIntersecting)) {
        setLoading(true);
        console.log('Elemento está visível', entradas);

        function fetchMoreData() {
          const newSearch = document.getElementById('input').value;
          setSearchValue(newSearch);
          setResultsNumber(resultsNumber + 5);
        }
        setTimeout(() => setLoading(false), 2000);
        setTimeout(() => fetchMoreData(), 1500);
      } else if (entradas.some((scroll) => scroll.isVisible === false)) {
        setLoading(false);
        console.log('Elemento está invisível', entradas);
      }
    });
    intersectionObserver.observe(document.querySelector('#sentinela'));
    return () => intersectionObserver.disconnect();
  }, []);

  /* Desativa o loading após a posição vertical (y) for menor ou igual a 1000px da página */
  useEffect(() => {
    function posicaoScrollLoading() {
      if (window.scrollY <= 1000) {
        setLoading(false);
        console.log('loading desativado');
      } else {
        setLoading(true);
        console.log('loading ativado');
      }
    }
    window.addEventListener('scroll', posicaoScrollLoading);
  }, []);

  /* Campo Input Search */
  const handleValue = (evento) => {
    if (evento.keyCode === 13) {

      /* Registra a busca digitada no AirTable */
      const registraHashtag = async () => {
        await airtableBuscaHashtag(evento.target.value);
      };

      setSearchValue(
        evento.target.value.replace(/[^a-zA-Z0-9_]/g, '').replace(' ', '')
      );

      setSearchResponse(<Loader />);
      setResultsNumber(10);
      setMoreRequest(10);
      registraHashtag();

      if (evento.target.value === '') {
        setSearchResponse(
          <div className={styles.textoErro}>Preencha este campo...⚠️</div>
        );
        setSearchValue('');
      }
    }

    if (evento.keyCode === 8) {
      setSearchResponse('');
      setSearchValue('');
      setTitleTag('');
      setResultsNumber(0);
    }

    if (evento.target.value.length >= 20) {
      setSearchResponse(
        <div className={styles.textoErro}>Limite máximo de caracteres 🚫</div>
      );
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
        setSearchResponse(
          <div className={styles.textoErro}>
            Nenhum tweet foi achado, tente novamente... ❌
          </div>
        );
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
                  <div className={styles.textoErro}>
                    Preencha este campo...⚠️
                  </div>
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
        <div
          className={
            tweets
              ? styles.containerTextoResultado
              : styles.containerTextoResultadoDesabilitada
          }>
          {tweets ? (
            <div className={styles.containerTextoResultado}>
              <p className={styles.TextoResultado}>
                Exibindo os {moreRequest > 0 ? moreRequest - 10 : null}{' '}
                resultados mais recentes para #{titleTag}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className={tweetImgs ? styles.container : styles.containerOculto}>
        <Slider settings={settingSlider}>
          {tweetImgs?.map(({ user, username, img, id }) => {
            return (
              <Slide key={id}>
                <div className={styles2.bgImageGallery}>
                  <img
                    src={img}
                    alt={user}
                    height='287px'
                    width='287px'
                    onClick={() => {
                      setImageActive({ user, username, img, id });
                    }}
                  />
                  <div className={styles2.bgPostUser}>
                    <a
                      href={`https://twitter.com/${username}/status/${id}`}
                      target='_blank'
                      rel='noreferrer'
                      alt={username}>
                      <p>Postado por:</p>
                      <h3>@{username}</h3>
                    </a>
                  </div>
                </div>
              </Slide>
            );
          })}
        </Slider>

        {imageActive && (
          <div
            key={imageActive.id}
            className={imageActive ? styles.modal : styles.modalDisabled}
            onClick={() => {
              setImageActive(false);
            }}>
            <div className={styles.modalContainer}>
              <img src={imageActive.img} alt={imageActive.username} />
              <button
                onClick={() => {
                  setImageActive(false);
                }}>
                X
              </button>
              <div className={styles.modalData} id='modaldata'>
                <a
                  href={`https://twitter.com/${imageActive.username}/status/${imageActive.id}`}
                  target='_blank'
                  rel='noreferrer'
                  alt=''>
                  <span>Postado por: </span>
                  <h4>@{imageActive.username}</h4>
                </a>
              </div>
              <div className={styles.boxshadow}></div>
            </div>
          </div>
        )}
      </div>

      <div
        className={
          tweets ? styles.containerTwitterCartao : styles.containerOculto
        }>
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
          <motion.div
            initial={{ y: animationMode, opacity: 1 }}
            animate={{ y: animationMode, opacity: 1 }}
            onClick={() => setAnimationMode(animationMode)}
            transition={{ duration: 0.5, delay: 0.4 }}>
            <div className={tweets ? styles.bgResponse : styles.bgLoader}>
              <div className={styles.textResponse}>{searchResponse}</div>
            </div>
          </motion.div>
        ) : null}
      </div>

      <div className={styles.container}>
        {loading ? (
          <motion.div
            initial={{ y: animationMode, opacity: 0 }}
            animate={{ y: animationMode, opacity: 1 }}
            onClick={() => setAnimationMode(animationMode)}
            transition={{ duration: 0.7, delay: 0.4 }}
            className={styles.bgLoader}>
            <Loader />
          </motion.div>
        ) : null}
      </div>

      <div id='sentinela'></div>
    </section>
  );
}
