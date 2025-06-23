const express = require('express');
const axios = require('axios');
const session = require('express-session');

const app = express();

require('dotenv').config()

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const SESSION_SECRET= process.env.SESSION_SECRET;

// Middleware pour gérer les sessions
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

//Route d’accueil -> redirige vers GitHub OAuth
app.get('/auth/github', (req, res) => {
    const state = Math.random().toString(36).substring(7); // random state
    req.session.oauth_state = state; 
    const scope = 'repo';
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${repo}&state=${state}`;
    res.redirect(githubAuthUrl);
})

app.get('/auth/callback', async (req, res) => {
    const { code, state } = req.query;

    if (!code){
        return res.send('Erreur: code manquant dans la requête.');
    }

    try{
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code: code,
                redirect_uri: REDIRECT_URI,
                state: state
            },
            {
                headers: {
                    Accept: 'application/json'
                },
            }
        );

        const tookenData = tokenResponse.data;
        
        if (tokenData.error){
            return res.send(`Erreur lors de l'obtention du token: ${tokenData.error_description}`);
        }

        const accessToken = tookenData.access_token;
    }catch (error) {
        res.send(`Erreur serveur: ${error.message}`);
    }
})

//Code permettant de récupérer les informations de l'utilisateur
async function getUserInfo(accessToken) {
  const response = await axios.get('https://api.github.com/user', {
    headers: {
      Authorization: `token ${accessToken}`,
      'User-Agent': 'SecuScan/v1.0', 
      Accept: 'application/vnd.github.v3+json',
    },
  });
  return response.data; 
}

//Route pour lister les dépôts de l'utilisateur
async function getUserRepos(accessToken) {
    const response = await axios.get('https://api.github.com/user/repos', {
      headers: {
        Authorization: `token ${accessToken}`,
        'User-Agent': 'SecuScan/v1.0',
        Accept: 'application/vnd.github.v3+json',
      },
      params: {
        visibility: 'all', //Repos private and public 
      },
    });
    return response.data;
  }

  //Route pour lister les fichiers d'un dépôt
  async function getRepoFiles(accessToken, owner, repo, branch = 'main') {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `token ${accessToken}`,
        'User-Agent': 'SecuScan/v1.0',
        Accept: 'application/vnd.github.v3+json',
      },
      params: {
        ref: branch,
      },
    });
    return response.data;
}