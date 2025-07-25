/**
 * Utilitário para logs que funciona apenas em desenvolvimento
 * Em produção, os logs são suprimidos automaticamente
 */

const isDevelopment = import.meta.env.MODE === 'development';

export const logger = {
  /**
   * Log de informação
   * @param {string} message - Mensagem a ser logada
   * @param {any} data - Dados adicionais (opcional)
   */
  info: (message, data = null) => {
    if (isDevelopment) {
      if (data) {
        console.log(`[INFO] ${message}`, data);
      } else {
        console.log(`[INFO] ${message}`);
      }
    }
  },

  /**
   * Log de erro
   * @param {string} message - Mensagem de erro
   * @param {Error|any} error - Erro ou dados adicionais
   */
  error: (message, error = null) => {
    if (isDevelopment) {
      if (error) {
        console.error(`[ERROR] ${message}`, error);
      } else {
        console.error(`[ERROR] ${message}`);
      }
    }
  },

  /**
   * Log de aviso
   * @param {string} message - Mensagem de aviso
   * @param {any} data - Dados adicionais (opcional)
   */
  warn: (message, data = null) => {
    if (isDevelopment) {
      if (data) {
        console.warn(`[WARN] ${message}`, data);
      } else {
        console.warn(`[WARN] ${message}`);
      }
    }
  },

  /**
   * Log de debug
   * @param {string} message - Mensagem de debug
   * @param {any} data - Dados adicionais (opcional)
   */
  debug: (message, data = null) => {
    if (isDevelopment) {
      if (data) {
        console.debug(`[DEBUG] ${message}`, data);
      } else {
        console.debug(`[DEBUG] ${message}`);
      }
    }
  },

  /**
   * Log de sucesso
   * @param {string} message - Mensagem de sucesso
   * @param {any} data - Dados adicionais (opcional)
   */
  success: (message, data = null) => {
    if (isDevelopment) {
      if (data) {
        console.log(`%c[SUCCESS] ${message}`, 'color: green; font-weight: bold;', data);
      } else {
        console.log(`%c[SUCCESS] ${message}`, 'color: green; font-weight: bold;');
      }
    }
  }
};