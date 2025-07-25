/* eslint-disable react/prop-types */
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

/**
 * Componente para proteger rotas privadas
 * @param {Object} props - Props do componente
 * @param {React.ReactNode} props.children - Componentes filhos
 * @param {string[]} props.allowedRoles - Roles permitidas (opcional)
 * @param {string} props.redirectTo - Rota de redirecionamento (padrão: /login)
 */
export default function Private({ 
  children, 
  allowedRoles = [], 
  redirectTo = "/login" 
}) {
  const { isAuthenticated, canAccess, loadingAuth } = useAuth();

  // Mostra loading enquanto verifica autenticação
  if (loadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner 
          size={60} 
          text="Verificando permissões..." 
          className="py-20"
        />
      </div>
    );
  }

  // Redireciona se não estiver autenticado
  if (!isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  // Verifica se tem as roles necessárias
  if (allowedRoles.length > 0 && !canAccess(allowedRoles)) {
    return <Navigate to="/paginaprincipal" replace />;
  }

  return children;
}
