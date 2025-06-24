import { Router } from 'express';
import axios from 'axios';

const router = Router();

//Redirection vers GitHub pour l'authentification
router.get('/github', (req, res) => {
    const state = Math.random().toString(36).substring(7); // random state
    req.session.oauth_state = state; 
    const scope = 'repo';
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=${scope}&state=${state}`;
    res.redirect(githubAuthUrl);
});

// Callback GitHub OAuth
router.get('/callback', async (req, res) => {
    const { code, state } = req.query;
    if (!code) {
      return res.status(400).send('Erreur: code manquant dans la requête.');
    }
    try {
      const tokenResponse = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code,
          redirect_uri: process.env.REDIRECT_URI,
          state
        },
        { headers: { Accept: 'application/json' } }
      );
  
      const tokenData = tokenResponse.data;
      if (tokenData.error) {
        return res.status(400).send(`Erreur lors de l'obtention du token: ${tokenData.error_description}`);
      }
  
      const accessToken = tokenData.access_token;
      req.session.accessToken = accessToken;
      res.redirect('http://localhost:5173/'); // Redirection vers ton front
    } catch (error) {
      res.status(500).send(`Erreur serveur: ${error.message}`);
    }
  });
  
  export default router;
  