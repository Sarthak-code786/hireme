const DEFAULT_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const getApiBaseUrl = () => {
  return localStorage.getItem('hireme_backend_url') || DEFAULT_API_URL;
};

export const setApiBaseUrl = (url) => {
  const cleanUrl = url.trim().replace(/\/+$/, '');
  localStorage.setItem('hireme_backend_url', cleanUrl);
  return cleanUrl;
};

export const resetApiBaseUrl = () => {
  localStorage.removeItem('hireme_backend_url');
  return DEFAULT_API_URL;
};

export const checkHealth = async (customUrl = null) => {
  const baseUrl = customUrl || getApiBaseUrl();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch(`${baseUrl}/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }
    const data = await res.json();
    return { ok: true, data };
  } catch (err) {
    clearTimeout(timeoutId);
    return {
      ok: false,
      error: err.name === 'AbortError' ? 'Connection timed out (4s)' : (err.message || 'Network error'),
    };
  }
};

export const sendChatMessage = async (question) => {
  const baseUrl = getApiBaseUrl();
  
  try {
    const response = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`Server responded with status ${response.status}: ${errorText || response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      answer: data.answer || "I don't have enough information to answer that.",
    };
  } catch (error) {
    console.error('Chat API Error:', error);
    return {
      success: false,
      error: error.message,
      troubleshoot: `Failed to reach backend at ${baseUrl}. Please ensure the FastAPI server is running with CORS enabled, or configure the backend URL in settings.`,
    };
  }
};
