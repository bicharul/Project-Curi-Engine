const API_CONFIG = {
  development: 'http://localhost:8000/api',
  production: 'https://your-backend-service.railway.app/api'
};

export const API_BASE_URL = 
  process.env.NODE_ENV === 'production' 
    ? API_CONFIG.production 
    : API_CONFIG.development;

export default API_CONFIG;
