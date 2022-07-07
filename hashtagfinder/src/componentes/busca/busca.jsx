import React, { useEffect, useState } from 'react';
import styles from './Busca.module.css';
import IconeBusca from '../../imagens/icones/icon-search.svg';

/* API do Twitter */
import { getTweets } from '../../api/GETTweets';
import { getTweetImagens } from '../../api/GETTweetImagens';

/* Componentes Loader (Animação e Cards do Twitter) */
import Loader from '../../componentes/loader/Loader';
import Twitter from '../twitter/twitter';
import { motion } from 'framer-motion';

/* Componentes Galeria de Imagens (Twitter) */
import { Slider, Slide } from '../../componentes/galeria/ExportPattern';
import { settingSlider } from '../../componentes/galeria/settings';
import styles2 from '../../componentes/galeria/sliderImage.module.css';

/* API do Airtable para registros de Twitter (busca) */
import { airtableBuscaHashtag } from '../../api/airtableBuscaHashtag';

export default function Busca(props) {
  const [valorPesquisa, setValorPesquisa] = useState('');
  const [valorResposta, setValorResposta] = useState('');
  const [tweets, setTweets] = useState(null);
  const [tweetImagens, setTweetImagens] = useState(null);
  const [maisRequisicao, setMaisRequisicao] = useState(10);
  const [tituloTag, setTituloTag] = useState();
  const [imagemAtiva, setImagemAtiva] = useState('');
  const [resultadoNumeral, setResultadoNumeral] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modoAnimacao, setModoAnimacao] = useState(0);

  useEffect(() => {
    if (valorPesquisa) {
      asyncCall();
      return () => {
        if (tweets) {
        }
        setValorResposta('');
        setValorPesquisa('');
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

        function fetchMoreData() {
          const newSearch = document.getElementById('input').value;
          setValorPesquisa(newSearch);
          setResultadoNumeral(resultadoNumeral + 5);
        }
        setTimeout(() => setLoading(false), 2000);
        setTimeout(() => fetchMoreData(), 1500);
      } else if (entradas.some((scroll) => scroll.isVisible === false)) {
        setLoading(false);
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
      } else {
        setLoading(true);
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

      setValorPesquisa(
        evento.target.value.replace(/[^a-zA-Z0-9_]/g, '').replace(' ', '')
      );

      /* Ativa o Loading (animação) */
      /* Ativa 10 imagens da galeria */
      /* Ativa 10 cartões (cards) do Twitter */
      /* Registra a hashtag digitada no Airtable */
      setValorResposta(<Loader />);
      setResultadoNumeral(10);
      setMaisRequisicao(10);
      registraHashtag();

      if (evento.target.value === '') {
        setValorResposta(
          <div className={styles.textoErro}>Preencha este campo...⚠️</div>
        );
        setValorPesquisa('');
      }
    }

    if (evento.keyCode === 8) {
      setValorResposta('');
      setValorPesquisa('');
      setTituloTag('');
      setResultadoNumeral(0);
    }

    if (evento.target.value.length >= 20) {
      setValorResposta(
        <div className={styles.textoErro}>Limite máximo de caracteres 🚫</div>
      );
    }
  };

  /* Função para chamar os Twitters (Galeria + Cards) */
  const asyncCall = () => {
    getTweets(valorPesquisa, maisRequisicao)
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

        setImagemAtiva(false);

        setTweets(tweetSet);

        getTweetImagens(valorPesquisa, maisRequisicao).then((tweetImagens) => {
          const imgSet = tweetImagens.data.map((tweet) => {
            const user = tweetImagens.includes.users.find(
              (user) => tweet.author_id === user.id
            );
            const img = tweetImagens.includes.media.find(
              (img) => tweet.attachments.media_keys[0] === img.media_key
            );

            return {
              id: tweet.id,
              img: img.url,
              username: user.username,
              user: user.name,
            };
          });

          setTweetImagens(imgSet);
          setTituloTag(valorPesquisa);
          setMaisRequisicao(maisRequisicao + 10);
        });
      })
      .catch(() => {
        setValorResposta(
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
              setValorResposta(<Loader />);
              setMaisRequisicao(10);
              setValorPesquisa(
                document
                  .getElementById('input')
                  .value.replace(/[^a-zA-Z0-9_]/g, '')
                  .replace(' ', '')
              );

              if (!document.getElementById('input').value.length) {
                setValorResposta(
                  <div className={styles.textoErro}>
                    Preencha este campo...⚠️
                  </div>
                );
                setValorPesquisa('');
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
                Exibindo os {maisRequisicao > 0 ? maisRequisicao - 10 : null}{' '}
                resultados mais recentes para #{tituloTag}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className={tweetImagens ? styles.container : styles.containerOculto}>
        <Slider settings={settingSlider}>
          {tweetImagens?.map(({ user, username, img, id }) => {
            return (
              <Slide key={id}>
                <div className={styles2.fundoImagemGaleria}>
                  <img
                    src={img}
                    alt={user}
                    height='287px'
                    width='287px'
                    onClick={() => {
                      setImagemAtiva({ user, username, img, id });
                    }}
                  />
                  <div className={styles2.fundoPostUsuario}>
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

        {imagemAtiva && (
          <div
            key={imagemAtiva.id}
            className={imagemAtiva ? styles.modal : styles.modalDesabilitado}
            onClick={() => {
              setImagemAtiva(false);
            }}>
            <div className={styles.modalContainer}>
              <img src={imagemAtiva.img} alt={imagemAtiva.username} />
              <button
                onClick={() => {
                  setImagemAtiva(false);
                }}>
                X
              </button>
              <div className={styles.modalData} id='modaldata'>
                <a
                  href={`https://twitter.com/${imagemAtiva.username}/status/${imagemAtiva.id}`}
                  target='_blank'
                  rel='noreferrer'
                  alt=''>
                  <span>Postado por: </span>
                  <h4>@{imagemAtiva.username}</h4>
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
        {valorResposta ? (
          <motion.div
            initial={{ y: modoAnimacao, opacity: 1 }}
            animate={{ y: modoAnimacao, opacity: 1 }}
            onClick={() => setModoAnimacao(modoAnimacao)}
            transition={{ duration: 0.5, delay: 0.4 }}>
            <div className={tweets ? styles.bgResponse : styles.bgLoader}>
              <div className={styles.textResponse}>{valorResposta}</div>
            </div>
          </motion.div>
        ) : null}
      </div>

      <div className={styles.container}>
        {loading ? (
          <motion.div
            initial={{ y: modoAnimacao, opacity: 0 }}
            animate={{ y: modoAnimacao, opacity: 1 }}
            onClick={() => setModoAnimacao(modoAnimacao)}
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
