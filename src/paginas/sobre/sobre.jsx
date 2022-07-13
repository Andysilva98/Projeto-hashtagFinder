import React, { useState, useEffect } from 'react';
import Cabecalho from '../../componentes/cabecalho/cabecalho';

/* Ícones dos Cartões dos Membros */
import Figura from '../../imagens/icones/about-illustration.svg';
import IconeGitHub from '../../imagens/icones/icon-github.svg';
import IconeEmail from '../../imagens/icones/icon-envelope.svg';
import IconeLikedIn from '../../imagens/icones/icon-linkedin.svg';

import Rodape from '../../componentes/rodape/rodape';
import styles from '../../paginas/sobre/Sobre.module.css';

const Sobre = () => {
  const [texto, setTexto] = useState('');
  const [equipe, setEquipe] = useState([]);
  const [ativaNav, setAtivaNav] = useState(false);

  useEffect(() => {
    document.title = 'hashtagfinder | Sobre';
  }, []);

  /* Utilizando a API AirTable */
  useEffect(() => {
    fetch(
      'https://api.airtable.com/v0/app6wQWfM6eJngkD4/Projeto?filterByFormula=' +
        encodeURI(`({Squad} = '04-22')`),
      {
        method: 'GET',
        headers: {
          Authorization: 'Bearer key2CwkHb0CKumjuM',
        },
      },
    )
      .then((res) => res.json())
      .then((response) => {
        setTexto(response.records[0].fields.Sobre);
      })
      .catch((erro) => console.log(erro));

    /* Fazendo fetch da API para pegar os dados do Squad */
    fetch(
      'https://api.airtable.com/v0/app6wQWfM6eJngkD4/Equipe?filterByFormula=' +
        encodeURI(`({Squad} = '04-22')`),
      {
        headers: {
          Authorization: 'Bearer key2CwkHb0CKumjuM',
        },
      },
    )
      .then((res) => res.json())
      .then((response) => {
        setEquipe(response.records);
      })
      .catch((erro) => console.log(erro));
  }, []);

  /* Ativa o cabeçalho após a posição vertical (y) 900 da página */
  useEffect(() => {
    function posicaoScroll() {
      if (window.scrollY >= 400) {
        setAtivaNav(true);
      } else {
        setAtivaNav(false);
      }
    }
    window.addEventListener('scroll', posicaoScroll);
  }, []);

  return (
    <div className={styles.sobre}>
        <Cabecalho acao={ativaNav} />
      <header className={styles.fundo}>
        <div className={styles.titulo}>
          <h1 className={styles.tituloTexto}>Sobre o projeto</h1>
        </div>
      </header>
      <main>
        <section className={styles.artigo}>
          <div className={styles.subtitulo}>
            <h2 className={styles.subtituloTexto}>O que é</h2>

            <div className={styles.blocoParagrafo}>
              <p
                className={styles.blocoParagrafoTexto}
                dangerouslySetInnerHTML={{ __html: texto }}
              />
            </div>
          </div>

          <div className={styles.blocoImagem}>
            <img
              src={Figura}
              alt="Imagem duas pessoas em um quadro com projeto"
            ></img>
          </div>
        </section>
      </main>
      <section className={styles.quemSomos}>
        <div className={styles.subtitulo2}>
          <h2 className={styles.subtitulo2Texto}>Quem somos</h2>
        </div>
      </section>
      /* Geração dos cartões dos membros através do AirTable (API) */
      <div className={styles.containerGeral}>
        {equipe.map((informacao, id) => (
          <div className={styles.container} key={id}>
            <div className={styles.containerMembros}>
              <div className={styles.containerCartaoMembros}>
                <img
                  className={styles.membroFoto}
                  src={informacao.fields.Imagem[0].url}
                  alt=" "
                />
                <div className={styles.informacaoMembros}>
                  <h3 className={styles.informacaoMembrosTitulo}>
                    {informacao.fields.Nome}
                  </h3>
                  <p className={styles.informacaoMembrosTexto}>
                    {informacao.fields.Descrição}
                  </p>
                </div>
                <div className={styles.containerIcones}>
                  <a
                    href={informacao.fields.Github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={IconeGitHub}
                      alt="icone"
                      className={styles.icones}
                      title="Github"
                    />
                  </a>
                  <a
                    href={informacao.fields.Email}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={IconeEmail}
                      alt="icone"
                      className={styles.icones}
                      title="Email"
                    />
                  </a>
                  <a
                    href={informacao.fields.LinkedIn}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <img
                      src={IconeLikedIn}
                      alt="icone"
                      className={styles.icones}
                      title="LinkedIn"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Rodape />
    </div>
  );
};

export default Sobre;
