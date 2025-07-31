import { useTheme } from '../contexts/ThemeContext';

/**
 * Hook personalizado para gerenciar o tema
 * @returns {Object} Objeto com funções e estado do tema
 */
export const useThemeToggle = () => {
  const { isDark, toggleTheme, setTheme, theme } = useTheme();

  /**
   * Alterna entre tema claro e escuro
   */
  const toggle = () => {
    toggleTheme();
  };

  /**
   * Define o tema especificamente
   * @param {string} newTheme - 'light' ou 'dark'
   */
  const setSpecificTheme = (newTheme) => {
    setTheme(newTheme);
  };

  /**
   * Retorna classes CSS condicionais baseadas no tema
   * @param {string} lightClass - Classe para tema claro
   * @param {string} darkClass - Classe para tema escuro
   * @returns {string} Classe apropriada para o tema atual
   */
  const getThemeClass = (lightClass, darkClass) => {
    return isDark ? darkClass : lightClass;
  };

  /**
   * Retorna classes CSS para tema escuro
   * @param {string} darkClass - Classe para tema escuro
   * @param {string} lightClass - Classe para tema claro (opcional)
   * @returns {string} Classe apropriada
   */
  const getDarkClass = (darkClass, lightClass = '') => {
    return isDark ? darkClass : lightClass;
  };

  return {
    isDark,
    theme,
    toggle,
    setSpecificTheme,
    getThemeClass,
    getDarkClass,
  };
}; 