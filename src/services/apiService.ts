const API_BASE_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000/api"
    : "/api";

export const apiService = {
  async register(name: string, email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;
  },

  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    return data;
  },

  async getCurrentUser(token: string) {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Authentication failed");
    }

    return data;
  },

  async translate(text: string, sourceLang: string, targetLang: string) {
    const response = await fetch(`${API_BASE_URL}/translation/translate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, sourceLang, targetLang }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Translation failed");
    }

    return data;
  },

  async saveConversationMessage(
    token: string,
    message: {
      sender: string;
      message: string;
      translatedText?: string;
      sourceLang: string;
      targetLang: string;
      signLang?: string;
      confidence?: number;
    }
  ) {
    const response = await fetch(`${API_BASE_URL}/conversation/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(message),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to save conversation message"
      );
    }

    return data;
  },

  async getConversationMessages(token: string) {
    const response = await fetch(`${API_BASE_URL}/conversation/messages`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to retrieve conversation messages"
      );
    }

    return data;
  },

  async clearConversationMessages(token: string) {
    const response = await fetch(`${API_BASE_URL}/conversation/messages`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to clear conversation messages"
      );
    }

    return data;
  },
};