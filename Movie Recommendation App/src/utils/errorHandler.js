/**
 * Utility for handling API errors
 */

export const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('API Error Response:', error.response.data);
    console.error('Status:', error.response.status);
    console.error('Headers:', error.response.headers);
    
    if (error.response.status === 401) {
      return { type: 'auth', message: 'Authentication failed. Please log in again.' };
    } else if (error.response.status === 404) {
      return { type: 'not-found', message: 'The requested resource was not found.' };
    } else if (error.response.status >= 500) {
      return { type: 'server', message: 'A server error occurred. Please try again later.' };
    }
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received:', error.request);
    return { type: 'network', message: 'No response received from server. Please check your internet connection.' };
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Request setup error:', error.message);
    return { type: 'unknown', message: 'An unexpected error occurred. Please try again.' };
  }
  
  return { type: 'general', message: 'Something went wrong. Please try again.' };
};

export const isOnline = () => {
  return navigator.onLine;
};

export const checkApiConnection = async (apiUrl) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(apiUrl, { 
      method: 'HEAD',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('API connection check failed:', error);
    return false;
  }
};