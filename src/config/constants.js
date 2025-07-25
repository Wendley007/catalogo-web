/**
 * Constantes da aplicação
 */

// Configurações da feira
export const FEIRA_CONFIG = {
  // Horário de funcionamento (domingo das 6h às 12h)
  DAYS: {
    SUNDAY: 0
  },
  HOURS: {
    START: 6,
    END: 12
  },
  // Informações da feira
  INFO: {
    NAME: "Feira de Buritizeiro",
    LOCATION: "Buritizeiro, MG",
    DESCRIPTION: "Feira livre com produtos frescos e locais"
  }
};

// Roles de usuário
export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
  CLIENTE: "cliente"
};

// Rotas da aplicação
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/registro",
  ADMIN: "/admin",
  MAIN: "/paginaprincipal",
  PROFILE: "/novoperfil",
  CATEGORIES: "/todascategorias",
  BANCAS: "/bancas",
  NEW_PRODUCT: "/novo",
  HISTORY: "/historia",
  LOCATION: "/localizacao",
  EVALUATION: "/avaliacao",
  RESULTS: "/resultados"
};

// Configurações de validação
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  PHONE_REGEX: /^\d{9,12}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};

// Configurações de upload
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ACCEPTED_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_IMAGES_PER_PRODUCT: 5
};

// Mensagens padrão
export const MESSAGES = {
  LOADING: "Carregando...",
  ERROR: {
    GENERIC: "Ocorreu um erro inesperado. Tente novamente.",
    NETWORK: "Erro de conexão. Verifique sua internet.",
    AUTH: "Erro de autenticação. Faça login novamente.",
    PERMISSION: "Você não tem permissão para esta ação.",
    VALIDATION: "Dados inválidos. Verifique os campos."
  },
  SUCCESS: {
    SAVE: "Dados salvos com sucesso!",
    DELETE: "Item removido com sucesso!",
    LOGIN: "Login realizado com sucesso!",
    LOGOUT: "Logout realizado com sucesso!"
  }
};

// Configurações do WhatsApp
export const WHATSAPP_CONFIG = {
  COUNTRY_CODE: "55",
  DEFAULT_MESSAGE: "Olá! Vi sua página no site da Feira de Buritizeiro e fiquei interessado!"
};