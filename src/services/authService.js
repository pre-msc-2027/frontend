const express = require('express');
const axios = require('axios');
const session = require('express-session');

const app = express();

const CLIENT_ID = 'Le client ID';
const CLIENT_SECRET = 'Le client secret';
const REDIRECT_URI = 'http://localhost:5173/auth/callback';

// Middleware pour gérer les sessions
app.use(session({
    secret: 'votre_secret_de_session',
    resave: false,
    saveUninitialized: true,
}));

//Route d’accueil -> redirige vers GitHub OAuth
app.get('/', (req, res) => {
    const state = Math.random().toString(36).substring(7); // random state
    req.session.oauth_state = state; 

    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=repo&state=${state}`;

    res.redirect(githubAuthUrl);
})

//Callback de GitHub OAuth
app.get('/callback', async (req, res) => {
    const {code, state} = req.query;

    //Vérification du state pour éviter les attaques CSRF
    if (state !== req.session.oauth_state) {
        return res.status(403).send('Invalid state.');
    }

    try{
        // Échange du code contre un token d'accès
        const response = await axios.post('htpps://github.com/login/oauth/access_token',{
            client_id : CLIENT_ID,
            client_secret : CLIENT_SECRET,
            code, 
            redirect_uri: REDIRECT_URI,
            state   
        }, {
            headers: {
                Accept: 'application/json'
            }
        });

        const accessToken = response.data.access_token;
        req.session.access_token = accessToken; // Stocker le token dans la session

        //TODO: Rediriger vers la page d'accueil ou une autre page de votre application

        const reposResponse = await axios.get('https://api.github.com/user/repos', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/vnd.github.v3+json'
            }
        }); 
        
        //lister ficher d'un repo
        app.get('/repos/:owner/:repo/contents', async (req, res) => {
            const { owner, repo } = req.params;
            try {
                const contentsResponse = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contents`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        Accept: 'application/vnd.github.v3+json'
                    }
                });
                res.json(contentsResponse.data);
            } catch (error) {
                res.status(500).send('Error fetching repository contents');
            }
        });
    } catch (error) {
        console.error('Error during GitHub OAuth callback:', error);
        res.status(500).send('An error occurred during authentication.');
    }
});