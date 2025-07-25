import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

/**
 * Hook customizado para funcionalidades de autenticação
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  /**
   * Verifica se o usuário tem uma role específica
   * @param {string} role - Role a ser verificada
   * @returns {boolean}
   */
  const hasRole = (role) => {
    return context.user?.role === role;
  };

  /**
   * Verifica se o usuário é admin
   * @returns {boolean}
   */
  const isAdmin = () => {
    return hasRole("admin");
  };

  /**
   * Verifica se o usuário está autenticado
   * @returns {boolean}
   */
  const isAuthenticated = () => {
    return context.signed;
  };

  /**
   * Verifica se o usuário pode acessar uma funcionalidade
   * @param {string[]} allowedRoles - Roles permitidas
   * @returns {boolean}
   */
  const canAccess = (allowedRoles = []) => {
    if (!isAuthenticated()) return false;
    if (allowedRoles.length === 0) return true;
    return allowedRoles.includes(context.user?.role);
  };

  return {
    ...context,
    hasRole,
    isAdmin,
    isAuthenticated,
    canAccess
  };
};