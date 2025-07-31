import { useContext } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

/**
 * Componente para proteger rotas que requerem autenticação
 */
export default function Private({ children, redirectTo = "/login" }) {
  const { signed, loadingAuth } = useContext(AuthContext);

  // Loading state com componente visual
  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redireciona se não estiver autenticado
  if (!signed) {
    return <Navigate to={redirectTo} replace />;
  }

  // Renderiza o conteúdo protegido
  return children;
}

Private.propTypes = {
  children: PropTypes.node.isRequired,
  redirectTo: PropTypes.string,
};

Private.defaultProps = {
  redirectTo: "/login",
};
