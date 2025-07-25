import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Private from "./routes/Private";
import ScrollTopo from "./components/ScrollTopo";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy loading dos componentes
const Home = lazy(() => import("./Pages/Home/Home"));
const Historia = lazy(() => import("./Pages/Historia/Historia"));
const Localizacao = lazy(() => import("./Pages/Localizacao/localizacao"));
const PaginaPrincipal = lazy(() => import("./Pages/PaginaPrincipal/PaginaPrincipal"));
const Novo = lazy(() => import("./Pages/Categorias/Novo/Novo"));
const Login = lazy(() => import("./Pages/Login/Login"));
const Registro = lazy(() => import("./Pages/Registro/Registro"));
const TodasCategorias = lazy(() => import("./Pages/Categorias/Todascategorias/Todascategorias"));
const ProdutosPorCategoria = lazy(() => import("./Pages/Categorias/ProdutosPorCategoria/ProdutosPorCategoria"));
const NovoPerfil = lazy(() => import("./Pages/Perfis/NovoPerfil/NovoPerfil"));
const Bancas = lazy(() => import("./Pages/Perfis/Bancas/Bancas"));
const Vendedor = lazy(() => import("./Pages/Perfis/Vendedor/Vendedor"));
const Admin = lazy(() => import("./Pages/Admin/Admin"));
const Resultados = lazy(() => import("./Pages/Avaliacao/Resultados"));
const Avaliacao = lazy(() => import("./Pages/Avaliacao/Avaliacao"));

/**
 * Componente de loading para rotas
 */
const RouteLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner 
      size={60} 
      text="Carregando página..." 
      className="py-20"
    />
  </div>
);

const Rotas = () => {
  return (
    <AuthProvider>
      <ScrollTopo />
      <Suspense fallback={<RouteLoading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="login" element={<Login />} />
          <Route path="registro" element={<Registro />} />
          <Route path="/historia" element={<Historia />} />
          <Route path="/localizacao" element={<Localizacao />} />
          <Route path="/paginaprincipal" element={<PaginaPrincipal />} />
          <Route
            path="/novo"
            element={
              <Private>
                <Novo />
              </Private>
            }
          />
          <Route path="/todascategorias" element={<TodasCategorias />} />
          <Route
            path="/categorias/:idCategoria"
            element={<ProdutosPorCategoria />}
          />
          <Route path="/novoperfil" element={<NovoPerfil />} />
          <Route path="/bancas" element={<Bancas />} />
          <Route path="/bancas/:bancaId" element={<Vendedor />} />
          <Route path="/avaliacao" element={<Avaliacao />} />
          <Route path="/resultados" element={<Resultados />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
};

export default Rotas;
