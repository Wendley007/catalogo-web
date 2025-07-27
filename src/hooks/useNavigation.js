import { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { PUBLIC_ROUTES, PROTECTED_ROUTES, ADMIN_ROUTES } from "../constants/routes";

/**
 * Hook personalizado para navegação e verificação de permissões
 */
export const useNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signed, user } = useContext(AuthContext);

  /**
   * Navega para uma rota específica
   */
  const goTo = (path) => {
    navigate(path);
  };

  /**
   * Navega para uma rota específica substituindo o histórico
   */
  const goToReplace = (path) => {
    navigate(path, { replace: true });
  };

  /**
   * Volta para a página anterior
   */
  const goBack = () => {
    navigate(-1);
  };

  /**
   * Verifica se o usuário tem permissão para acessar uma rota
   */
  const canAccess = (path) => {
    // Rotas públicas sempre acessíveis
    if (Object.values(PUBLIC_ROUTES).includes(path)) {
      return true;
    }

    // Rotas protegidas requerem autenticação
    if (Object.values(PROTECTED_ROUTES).includes(path)) {
      return signed;
    }

    // Rotas de admin requerem role admin
    if (Object.values(ADMIN_ROUTES).includes(path)) {
      return signed && user?.role === "admin";
    }

    return false;
  };

  /**
   * Verifica se a rota atual é protegida
   */
  const isProtectedRoute = () => {
    const currentPath = location.pathname;
    return Object.values(PROTECTED_ROUTES).includes(currentPath) ||
           Object.values(ADMIN_ROUTES).includes(currentPath);
  };

  /**
   * Verifica se a rota atual é de admin
   */
  const isAdminRoute = () => {
    const currentPath = location.pathname;
    return Object.values(ADMIN_ROUTES).includes(currentPath);
  };

  /**
   * Obtém o nome da rota atual
   */
  const getCurrentRouteName = () => {
    const currentPath = location.pathname;
    
    // Remove parâmetros dinâmicos para comparação
    const cleanPath = currentPath.replace(/\/:[^/]+/g, "");
    
    // Mapeia os nomes das rotas
    const routeNames = {
      [PUBLIC_ROUTES.HOME]: "Início",
      [PUBLIC_ROUTES.LOGIN]: "Login",
      [PUBLIC_ROUTES.REGISTRO]: "Registro",
      [PUBLIC_ROUTES.HISTORIA]: "História",
      [PUBLIC_ROUTES.LOCALIZACAO]: "Localização",
      [PUBLIC_ROUTES.PAGINA_PRINCIPAL]: "Página Principal",
      [PUBLIC_ROUTES.TODAS_CATEGORIAS]: "Categorias",
      [PUBLIC_ROUTES.BANCAS]: "Bancas",
      [PUBLIC_ROUTES.AVALIACAO]: "Avaliação",
      [PUBLIC_ROUTES.RESULTADOS]: "Resultados",
      [PROTECTED_ROUTES.NOVO]: "Novo Produto",
      [PROTECTED_ROUTES.NOVO_PERFIL]: "Novo Perfil",
      [ADMIN_ROUTES.ADMIN]: "Administração",
    };

    return routeNames[cleanPath] || "Página não encontrada";
  };

  return {
    goTo,
    goToReplace,
    goBack,
    canAccess,
    isProtectedRoute,
    isAdminRoute,
    getCurrentRouteName,
    currentPath: location.pathname,
    signed,
    user,
  };
}; 