// Environment configuration
const getBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return 'http://localhost:3000/backend';
  }
  // Production
  return 'https://four-dars-home.onrender.com/backend';
};

const BASE_URL = getBaseUrl();

console.log('API Base URL:', BASE_URL);
