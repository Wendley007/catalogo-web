import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo1 from "../../assets/logo1.png";
import fundo from "../../assets/fundo.jpg";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";

const Home = () => {
  const [loading, setLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    async function handleLogout() {
      await signOut(auth);
      setLoading(false); // Define o carregamento como falso após a saída
    }

    handleLogout();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-white">Carregando...</p>
      </div>
    );
  }

  return (
    <div
      className="bg-cover bg-no-repeat bg-center bg-fixed h-screen"
      style={{ backgroundImage: `url(${fundo})` }}
    >
      <div
        className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
      >
        <div className="flex h-full items-center justify-center">
          <div className="px-6 text-center text-white md:px-12">
            <Link to="/" className="flex items-center">
              <motion.img
                src={logo1}
                alt="Logo"
                className="w-36 ml-8 h-34"
                whileHover={{ scale: 1.1 }}
              />
            </Link>

            <h1 className="mb-6 text-5xl font-bold">Viva Bem</h1>
            <h3 className="mb-8 text-3xl font-bold">Buritizeiro</h3>

            <div className="absolute top-0 right-0 mt-6 mr-6">
              <Link to="/Login">
                <button
                  type="button"
                  className="inline-block rounded border-neutral-50 px-6 pb-[6px] pt-2 text-xs leading-normal text-neutral-50 transition duration-150 ease-in-out hover:border-neutral-100 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-neutral-100 focus:border-neutral-100 focus:text-neutral-100 focus:outline-none focus:ring-0 active:border-neutral-200 active:text-neutral-200 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
                  data-te-ripple-init
                  data-te-ripple-color="light"
                >
                  Login
                </button>
              </Link>
            </div>

            <div className="flex flex-col">
              <Link
                to="/paginaprincipal"
                className="inline-block rounded border-2 border-neutral-50 px-6 pb-[6px] pt-2 text-xs font-medium uppercase leading-normal text-neutral-50 transition duration-150 ease-in-out hover:border-neutral-100 hover:bg-neutral-500 hover:bg-opacity-10 hover:text-neutral-100 focus:border-neutral-100 focus:text-neutral-100 focus:outline-none focus:ring-0 active:border-neutral-200 active:text-neutral-200 dark:hover:bg-neutral-100 dark:hover:bg-opacity-10"
              >
                Acessar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
