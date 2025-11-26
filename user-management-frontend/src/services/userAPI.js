import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/users';

// Standard Authentifizierung mit Basic Auth
const createAuthConfig = (username, password) => ({
  auth: {
    username,
    password
  }
});

/**
 * User API Service - Kommunikation mit dem Backend
 */
export const userAPI = {
  
  /**
   * Alle Benutzer abrufen
   */
  getAllUsers: async (username, password) => {
    try {
      const response = await axios.get(API_BASE_URL, createAuthConfig(username, password));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Fehler beim Abrufen der Benutzer');
    }
  },

  /**
   * Benutzer nach ID abrufen
   */
  getUserById: async (id, username, password) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`, createAuthConfig(username, password));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Benutzer nicht gefunden');
    }
  },

  /**
   * Neuen Benutzer erstellen
   */
  createUser: async (userData, username, password) => {
    try {
      const response = await axios.post(API_BASE_URL, userData, createAuthConfig(username, password));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Fehler beim Erstellen des Benutzers');
    }
  },

  /**
   * Benutzer aktualisieren
   */
  updateUser: async (id, userData, username, password) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, userData, createAuthConfig(username, password));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Fehler beim Aktualisieren des Benutzers');
    }
  },

  /**
   * Benutzer löschen
   */
  deleteUser: async (id, username, password) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`, createAuthConfig(username, password));
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Fehler beim Löschen des Benutzers');
    }
  },

  /**
   * Benutzer deaktivieren
   */
  deactivateUser: async (id, username, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${id}/deactivate`, {}, createAuthConfig(username, password));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Fehler beim Deaktivieren des Benutzers');
    }
  },

  /**
   * Benutzer aktivieren
   */
  activateUser: async (id, username, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/${id}/activate`, {}, createAuthConfig(username, password));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Fehler beim Aktivieren des Benutzers');
    }
  },

  /**
   * Passwort ändern
   */
  changePassword: async (id, newPassword, username, password) => {
    try {
      await axios.post(`${API_BASE_URL}/${id}/change-password`, { newPassword }, createAuthConfig(username, password));
      return true;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Fehler beim Ändern des Passworts');
    }
  },

  /**
   * Benutzer nach Rolle filtern
   */
  getUsersByRole: async (role, username, password) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/role/${role}`, createAuthConfig(username, password));
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Fehler beim Abrufen der Benutzer');
    }
  }
};
