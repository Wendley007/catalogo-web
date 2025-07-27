/**
 * Constantes de rotas da aplicação
 * Centraliza todas as rotas para facilitar manutenção
 */

// Rotas públicas
export const PUBLIC_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTRO: "/registro",
  HISTORIA: "/historia",
  LOCALIZACAO: "/localizacao",
  PAGINA_PRINCIPAL: "/paginaprincipal",
  TODAS_CATEGORIAS: "/todascategorias",
  CATEGORIA: "/categorias/:idCategoria",
  BANCAS: "/bancas",
  BANCA_DETAIL: "/bancas/:bancaId",
  AVALIACAO: "/avaliacao",
  RESULTADOS: "/resultados",
};

// Rotas protegidas (requerem autenticação)
export const PROTECTED_ROUTES = {
  NOVO: "/novo",
  NOVO_PERFIL: "/novoperfil",
};

// Rotas de administrador (requerem role admin)
export const ADMIN_ROUTES = {
  ADMIN: "/admin",
};

// Redirecionamentos padrão
export const REDIRECTS = {
  LOGIN: "/login",
  HOME: "/",
  PAGINA_PRINCIPAL: "/paginaprincipal",
  ADMIN: "/admin",
};

// Nomes das rotas para navegação
export const ROUTE_NAMES = {
  HOME: "Início",
  LOGIN: "Login",
  REGISTRO: "Registro",
  HISTORIA: "História",
  LOCALIZACAO: "Localização",
  PAGINA_PRINCIPAL: "Página Principal",
  TODAS_CATEGORIAS: "Categorias",
  BANCAS: "Bancas",
  AVALIACAO: "Avaliação",
  RESULTADOS: "Resultados",
  NOVO: "Novo Produto",
  NOVO_PERFIL: "Novo Perfil",
  ADMIN: "Administração",
};

// Configurações de proteção por rota
export const ROUTE_PROTECTION = {
  [PUBLIC_ROUTES.NOVO]: "auth", // Requer apenas autenticação
  [PUBLIC_ROUTES.NOVO_PERFIL]: "auth", // Requer apenas autenticação
  [ADMIN_ROUTES.ADMIN]: "admin", // Requer role admin
};

// Rotas que não devem aparecer no menu
export const HIDDEN_ROUTES = [
  PUBLIC_ROUTES.LOGIN,
  PUBLIC_ROUTES.REGISTRO,
  PUBLIC_ROUTES.CATEGORIA,
  PUBLIC_ROUTES.BANCA_DETAIL,
  PUBLIC_ROUTES.AVALIACAO,
  PUBLIC_ROUTES.RESULTADOS,
  PROTECTED_ROUTES.NOVO,
  PROTECTED_ROUTES.NOVO_PERFIL,
  ADMIN_ROUTES.ADMIN,
];
