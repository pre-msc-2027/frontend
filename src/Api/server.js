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
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: 'my-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));
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

        // 🔑 Fetch user info to store username in session
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: { Authorization: `token ${accessToken}` }
        });

        req.session.username = userResponse.data.login;
        console.log(`✅ GitHub user authenticated: ${req.session.username}`);

        res.redirect('http://localhost:5173/dashboard'); // frontend dashboard
    } catch (err) {
        console.error(err.response?.data || err.message);
        res.status(500).send('Erreur serveur');
    }
});

app.get('/auth/userinfo', (req, res) => {
    if (!req.session.username) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    const userInfo = {
        username: req.session.username,
        accessToken: req.session.accessToken // optional, usually don’t send token to frontend
    };

    console.log("📌 Returning user info to frontend:", userInfo);
    res.json(userInfo);
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

    console.log("➡️ /auth/repos/:repoName/branches called");
    console.log("Session object:", req.session);

    if (!token || !username) {
        console.log("❌ No access token or username in session");
        return res.status(401).json({ error: 'User not authenticated' });
    }

    try {
        console.log(`Fetching branch0es for ${username}/${repoName} from GitHub...`);

        const branchResponse = await axios.get(
            `https://api.github.com/repos/${username}/${repoName}/branches`,
            { headers: { Authorization: `token ${token}` } }
        );

        const branches = branchResponse.data.map(b => b.name);
        console.log("🌿 Branches fetched:", branches);
        res.json(branches);
    } catch (err) {
        console.error('❌ Error fetching branches:', err.response?.data || err.message);
        res.status(500).json({ error: 'Impossible de récupérer les branches' });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));
