import express from 'express';
import session from 'express-session';
import cors from 'cors';
import axios from 'axios';
import 'dotenv/config';

const app = express();
console.log('CLIENT_ID:', process.env.CLIENT_ID);
console.log('REDIRECT_URI:', process.env.REDIRECT_URI);
// --- Middleware ---
app.use(cors({
    origin: 'http://localhost:5173', // frontend URL
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // set true only if HTTPS
}));

// --- Routes ---
// 1. Redirect to GitHub for OAuth login
app.get('/auth/github', (req, res) => {
    const state = Math.random().toString(36).substring(7);
    req.session.oauth_state = state;
    const scope = 'repo';
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=${scope}&state=${state}`;

    console.log("👉 Redirecting to GitHub:", githubAuthUrl);
    res.redirect(githubAuthUrl);
});

// 2. GitHub OAuth callback
app.get('/auth/callback', async (req, res) => {
    const { code, state } = req.query;

    if (!code) return res.status(400).send('Erreur: code manquant');

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

        const accessToken = tokenResponse.data.access_token;
        req.session.accessToken = accessToken;

        // Get the authenticated user's username
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `token ${accessToken}` }
        });
        const username = userResponse.data.login;
        req.session.username = username;

        console.log('✅ GitHub token saved in session:', username);
        res.redirect('http://localhost:5173/dashboard'); // frontend dashboard
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

// 3. Fetch authenticated user's repos
app.get('/auth/repos', async (req, res) => {
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
            params: { per_page: 100, sort: 'updated' }
        });

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

app.get('/auth/repos/:repoName/branches', async (req, res) => {
    const token = req.session.accessToken;
    const username = req.session.username;
    const { repoName } = req.params;

    if (!token) return res.status(401).json({ error: 'Utilisateur non authentifié' });

    try {

        // Fetch branches for the repo
        const branchResponse = await axios.get(
            `https://api.github.com/repos/${username}/${repoName}/branches`,
            { headers: { Authorization: `token ${token}` } }
        );

        const branches = branchResponse.data.map(branch => branch.name);
        res.json(branches);
    } catch (error) {
        console.error('❌ Error fetching branches:', error.response?.data || error.message);
        res.status(500).json({ error: 'Impossible de récupérer les branches' });
    }
});
app.listen(5000, () => console.log('Server running on port 5000'));

//Get rules from external API
app.get('/rules', async (req, res) => {
    try {
        const response = await axios.get(`${process.env.API_URL}/rules/`, {
            withCredentials: true,
        });
        const rules = response.data;

        res.json(rules);
    } catch (err) {
        console.error("Error when fetching rules:", err);
        res.status(500).json({ error: "Failed to fetch rules" });
    }
});
//GET Summary for my User
app.get('/scans/summary', async (req, res) => {
    const username = req.session.username;
    if (!username) {
        return res.status(401).json({ error: "Unknown User" });
    }
    try {
        const response = await axios.get(`${process.env.API_URL}/scans/summary/${username}/`, {
            withCredentials: true,
        });

        const scans = response.data;
        console.log(JSON.stringify(scans, null, 2));
        res.json(scans);
    } catch (err) {
        console.error("❌ Error when fetching rules:", err);
        res.status(500).json({ error: "Failed to fetch added Repo" });
    }
});

