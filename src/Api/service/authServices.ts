import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export const loginWithGitHub = () => {
    window.location.href = `${apiUrl}/auth/github`;
}

export const handleGitHubCallback = async (code: string, state: string) => {
    try {
        const response = await axios.get(`${apiUrl}/auth/callback`, {
            params: {
                code: code,
                state: state
            }
        });
        return response.data; 
    } catch (error) {
        console.error('Error during GitHub callback:', error);
        throw error;
    }
}