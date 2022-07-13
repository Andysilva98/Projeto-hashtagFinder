const airtableBuscaHashtag = async (searchValue) => {
  
  //------------------------------- INICIO DO FETCH -------------------------------
  // Esse fetch salva a pesquisa no airtable para depois ser puxado na listagem de histórico
  fetch('https://api.airtable.com/v0/app6wQWfM6eJngkD4/Buscas', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer key2CwkHb0CKumjuM',
      'Content-type': 'application/json',
    },
    body: JSON.stringify({
      records: [
        {
          fields: {
            Squad: '04-22',
            Hashtag: searchValue,
            Data: new Date().getTime(),
          },
        },
      ],
    }),
  });

  //console.log("sucess");
  //------------------------------- FIM DO FETCH -------------------------------
};

export { airtableBuscaHashtag };