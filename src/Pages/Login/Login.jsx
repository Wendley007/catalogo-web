import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import logo from "../../assets/logo.webp";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../components/Input";
import fundo from "../../assets/fundo.webp";
import {
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../../services/firebaseConnection";
import { FaGoogle } from "react-icons/fa";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/AuthContext";
import SEO from "../../components/SEO/SEO";

const schema = z.object({
  email: z
    .string()
    .email("Insira um email válido")
    .nonempty("O campo email é obrigatório"),
  password: z.string().nonempty("O campo senha é obrigatório"),
});

const Login = () => {
  // Adicionar classe auth-page para remover espaçamento
  useEffect(() => {
    document.body.classList.add('auth-page');
    return () => {
      document.body.classList.remove('auth-page');
    };
  }, []);

  const { handleInfoUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const [message, setMessage] = useState("");
  const [isGoogleLogin, setIsGoogleLogin] = useState(false);

  useEffect(() => {
    async function handleLogout() {
      await signOut(auth);
    }

    handleLogout();
  }, []);

  const onSubmit = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      setMessage("Login efetuado com sucesso!");

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();

      handleInfoUser({
        name: user.displayName || "Nome não definido",
        email: user.email,
        uid: user.uid,
        role: userData.role || "cliente",
      });

      reset();

      navigate("/paginaprincipal", { replace: true });
    } catch (error) {
      setMessage(
        "Erro ao fazer o login. Por favor, verifique suas credenciais."
      );
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLogin(true);
    reset();

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // Salvar foto de perfil (photoURL) e outros dados
        await setDoc(userDocRef, {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL || "",
          role: "cliente",
        });
        setMessage(
          "Login efetuado com Google! Bem-vindo(a) a Feira Livre de Buritizeiro."
        );
      } else {
        const userData = userDoc.data();
        
        // Atualizar photoURL se o usuário do Google tiver uma nova foto
        if (user.photoURL && user.photoURL !== userData.photoURL) {
          await setDoc(userDocRef, {
            ...userData,
            photoURL: user.photoURL,
          }, { merge: true });
        }
        
        handleInfoUser({
          name: user.displayName,
          email: user.email,
          uid: user.uid,
          role: userData.role || "cliente",
          photoURL: user.photoURL || userData.photoURL || "",
        });

        setMessage("Bem-vindo(a) de volta!");
      }

      reset();

      // Redireciona após 3 segundos
      setTimeout(() => {
        navigate("/paginaprincipal", { replace: true });
      }, 3000);
    } catch (error) {
      setMessage("Erro ao fazer login com o Google. Tente novamente.");
    } finally {
      setIsGoogleLogin(false);
    }
  };

  return (
    <>
      <SEO 
        title="Login"
        description="Acesse sua conta na Feira Livre de Buritizeiro"
        noindex={true}
        nofollow={true}
      />
      <main
        className="bg-cover bg-no-repeat bg-center bg-fixed min-h-screen"
        style={{ backgroundImage: `url(${fundo})` }}
      >
        <div
          className="w-full min-h-screen flex justify-center items-center flex-col gap-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
        >
          {/* Logo e Título */}
          <Link
            to="/"
            className="max-w-sm w-full flex flex-col items-center mt-10"
          >
            <img src={logo} alt="Logo" className="w-32 mx-auto animate-bounce" />
          </Link>

          <form
            className="bg-white max-w-md w-full bg-opacity-10 text-sm backdrop-blur-md rounded-2xl p-8 shadow-lg"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h1 className="text-center mb-6 text-gray-200 font-bold text-xl">
              LOGIN
            </h1>
            <div className="mb-6">
              <Input
                type="email"
                placeholder="Digite seu email..."
                name="email"
                label="Email"
                required
                error={!isGoogleLogin && errors.email?.message}
                register={register}
              />
            </div>

            <div className="mb-6">
              <Input
                type="password"
                placeholder="Digite sua senha..."
                name="password"
                label="Senha"
                required
                error={!isGoogleLogin && errors.password?.message}
                register={register}
              />
            </div>

            <button
              type="submit"
              className="bg-zinc-800 w-full text-sm hover:bg-zinc-900 rounded-md text-white py-3 font-medium transition duration-300 transform hover:scale-105"
            >
              Acessar
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-200">ou</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {message && (
              <p
                className={`text-center mt-2 
                  ${
                    message.includes("sucesso")
                      ? "text-green-400"
                      : message.includes("Google! Bem-vindo") ||
                        message.includes("Bem-vindo(a) de volta!")
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
              >
                {message}
              </p>
            )}


            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={handleGoogleLogin}
                className="bg-red-500 text-white text-sm rounded-md px-2 py-3 flex items-center justify-center gap-2"
              >
                <FaGoogle size={20} /> Entrar com Google
              </button>
              <Link
                to="/Registro"
                className="text-white inline-block mt-4 text-sm text-center hover:bg-zinc-500 py-3 px-2 rounded-md transition duration-300 ease-in-out"
              >
                Ainda não possui uma conta? Cadastre-se.
              </Link>
            </div>
          </form>
          <div className="flex flex-col gap-2">
            <Link
              to="/"
              className="text-white text-sm mb-10 hover:bg-zinc-500 rounded-md py-2 px-2 text-center transition duration-300 ease-in-out"
            >
              Voltar ao Início
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;
