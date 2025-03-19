import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import Historia from "./Pages/Historia/Historia";
import Contato from "./Pages/Contato/Contato";
import Galeria from "./Pages/Galeria/Galeria";
import PaginaPrincipal from "./Pages/PaginaPrincipal/PaginaPrincipal";
import Novo from "./Pages/Categorias/Novo/Novo";
import Login from "./Pages/Login/Login";
import Registro from "./Pages/Registro/Registro";
import { AuthProvider } from "./contexts/AuthContext";
import Private from "./routes/Private";
import TodasCategorias from "./Pages/Categorias/Todascategorias/Todascategorias";
import ProdutosPorCategoria from "./Pages/Categorias/ProdutosPorCategoria/ProdutosPorCategoria";
import NovoPerfil from "./Pages/Perfis/NovoPerfil/NovoPerfil";
import Bancas from "./Pages/Perfis/Bancas/Bancas";
import Vendedor from "./Pages/Perfis/Vendedor/Vendedor";
import Admin from "./Pages/Admin/Admin";
import Resultados from "./Pages/Avaliacao/Resultados";
import Avaliacao from "./Pages/Avaliacao/Avaliacao";

const Rotas = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/admin" element={<Admin />} />

        <Route path="login" element={<Login />} />

        <Route path="registro" element={<Registro />} />

        <Route path="/historia" element={<Historia />} />

        <Route path="/contato" element={<Contato />} />

        <Route path="/galeria" element={<Galeria />} />

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
    </AuthProvider>
  );
};

export default Rotas;
