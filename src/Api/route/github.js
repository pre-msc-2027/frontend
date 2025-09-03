import { Router } from 'express';
import axios from "axios";


const router = Router();

router.get('/github', (req, res) => {
    const state = Math.random().toString(36).substring(7);
    req.session.oauth_state = state;
    const scope = 'repo';
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=${scope}&state=${state}`;

    console.log("👉 Redirecting to GitHub:", githubAuthUrl); // DEBUG
    res.redirect(githubAuthUrl);
});

// GitHub callback
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

        res.redirect(`${process.env.FRONTEND_URL}/dashboard`); // redirect to dashboard
    } catch (error) {
        res.status(500).send(`Erreur serveur: ${error.message}`);
    }
});




router.get('/auth/repos', async (req, res) => {
    console.log("➡️ /auth/repos called");

    const token = req.session.accessToken;
    if (!token) {
        console.log("❌ No access token in session");
        return res.status(401).json({ error: 'Utilisateur non authentifié' });
    }

    try {
        const response = await axios.get('https://api.github.com/user/repos', {
            headers: {
                Authorization: `token ${token}`,
                Accept: 'application/vnd.github+json'
            },
            params: {
                per_page: 100,
                sort: 'updated'
            }
        });

        console.log("✅ Repos fetched from GitHub, count:", response.data.length);

        const repos = response.data.map(repo => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            html_url: repo.html_url,
            description: repo.description,
            private: repo.private
        }));

        console.log("📦 Sending mapped repos:", repos.map(r => r.full_name));

        res.json(repos);
    } catch (error) {
        console.error('❌ Error fetching repos:', error.response?.data || error.message);
        res.status(500).json({ error: 'Impossible de récupérer les repos' });
    }
});

export default router;