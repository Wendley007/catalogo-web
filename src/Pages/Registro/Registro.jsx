import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import logo from "../../assets/logo.webp";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../../components/Input";
import fundo from "../../assets/fundo.webp";
import SEO from "../../components/SEO/SEO";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../../services/firebaseConnection";
import { FaGoogle } from "react-icons/fa";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/AuthContext";
import { RingLoader } from "react-spinners";

const schema = z.object({
  name: z
    .string()
    .nonempty("O campo nome é obrigatório")
    .max(20, "O nome não pode ter mais de 20 caracteres")
    .refine((value) => value.split(" ").length === 2, {
      message: "O nome deve conter apenas duas palavras",
    }),

  email: z
    .string()
    .email("Insira um email válido")
    .nonempty("O campo email é obrigatório")
    .max(35, "O email não pode ter mais de 35 caracteres"),

  password: z.string().nonempty("O campo senha é obrigatório"),

  role: z.enum(["cliente", "admin"], {
    invalid_type_error: "Escolha um usuário válido",
  }),
});

const Registro = () => {
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
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [canRedirect, setCanRedirect] = useState(false);
  const [isAdminDisabled, setIsAdminDisabled] = useState(false);

  useEffect(() => {
    const handleLogout = async () => {
      await signOut(auth);
    };

    handleLogout();
  }, []);

  const countAdmins = async () => {
    const adminsQuery = query(
      collection(db, "users"),
      where("role", "==", "admin")
    );
    const adminsSnapshot = await getDocs(adminsQuery);
    return adminsSnapshot.size;
  };

  useEffect(() => {
    const checkAdminLimit = async () => {
      const numAdmins = await countAdmins();
      if (numAdmins >= 2) {
        setIsAdminDisabled(false);
      }
    };

    checkAdminLimit();
  }, []);

  const checkUserExists = async (email, name) => {
    const usersQuery = query(
      collection(db, "users"),
      where("email", "==", email)
    );
    const usersSnapshot = await getDocs(usersQuery);

    const emailExists = usersSnapshot.docs.some(
      (doc) => doc.data().email === email
    );
    const nameExists = usersSnapshot.docs.some(
      (doc) => doc.data().name === name
    );

    return { emailExists, nameExists };
  };

  const verifyAndRegisterUser = async (data) => {
    const { emailExists, nameExists } = await checkUserExists(
      data.email,
      data.name
    );
    if (emailExists) {
      setMessage("Este email já está cadastrado.");
      return false;
    }
    if (nameExists) {
      setMessage("Este nome já está cadastrado.");
      return false;
    }

    const numAdmins = await countAdmins();
    if (data.role === "admin" && numAdmins >= 2) {
      setMessage("O cadastro para administrador está indisponível.");
      setIsAdminDisabled(true);
      return false;
    }

    return true;
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const isValid = await verifyAndRegisterUser(data);
      if (!isValid) {
        setIsLoading(false);
        return;
      }
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      await updateProfile(userCredential.user, { displayName: data.name });
      await sendEmailVerification(userCredential.user);
      setMessage("Por favor, verifique seu e-mail para ativar sua conta.");

      const interval = setInterval(async () => {
        await userCredential.user.reload();
        if (userCredential.user.emailVerified) {
          clearInterval(interval);
          setMessage("E-mail verificado! Bem-vindo à feira de Buritizeiro!");

          const userDocRef = doc(db, "users", userCredential.user.uid);
          await setDoc(userDocRef, {
            name: data.name,
            email: data.email,
            role: data.role,
          });

          handleInfoUser({
            name: data.name,
            email: data.email,
            uid: userCredential.user.uid,
            role: data.role,
          });
          setTimeout(() => {
            setCanRedirect(true);
          }, 3000);
        } else {
          setMessage("Verifique seu e-mail e clique no link de ativação.");
        }
      }, 4000);
      return () => clearInterval(interval);
    } catch (error) {
      console.error("Erro ao efetuar o cadastro:", error);
      setIsLoading(false);
      if (error.code) {
        switch (error.code) {
          case "auth/invalid-email":
            setMessage("O e-mail fornecido é inválido.");
            break;
          case "auth/email-already-in-use":
            setMessage("Este email já está cadastrado.");
            break;
          case "auth/weak-password":
            setMessage("A senha deve ter pelo menos 6 caracteres.");
            break;
          default:
            setMessage("Erro desconhecido, tente novamente.");
        }
      } else {
        setMessage("Erro ao efetuar o cadastro. Por favor, tente novamente.");
      }
    }
  };

  useEffect(() => {
    if (canRedirect) {
      navigate("/paginaprincipal", { replace: true });
    }
  }, [canRedirect, navigate]);

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          name: user.displayName,
          email: user.email,
          role: "cliente",
          photoURL: user.photoURL || "", // Salva a foto de perfil (caso exista)
        });
        setMessage("Cadastro efetuado com Google! Bem-vindo.");
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
        setMessage("Bem-vindo(a) a Feira Livre de Buritizeiro");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setMessage("Erro ao tentar fazer login.");
    }
  };



  return (
    <div
      className="relative bg-cover bg-no-repeat bg-center h-full"
      style={{ backgroundImage: `url(${fundo})` }}
    >
      <SEO
        title="Registro - Feira Livre de Buritizeiro"
        description="Cadastre-se na Feira Livre de Buritizeiro para ter acesso a todas as funcionalidades."
      />
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
            REGISTRO
          </h1>
          <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
            <div>
              <Input
                type="text"
                placeholder="Digite seu nome completo..."
                name="name"
                label="Nome Completo"
                required
                error={errors.name?.message}
                register={register}
                maxLength={35}
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Digite seu email..."
                name="email"
                label="Email"
                required
                error={errors.email?.message}
                register={register}
                maxLength={35}
              />
            </div>
          </div>
          <div className="mb-6">
            <Input
              type="password"
              placeholder="Digite sua senha..."
              name="password"
              label="Senha"
              required
              error={errors.password?.message}
              register={register}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-200 mb-2"
            >
              Tipo de usuário
              <span className="text-red-400 ml-1">*</span>
            </label>

            <select
              id="role"
              {...register("role")}
              className={`
                w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
                bg-white/10 backdrop-blur-sm text-white
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400
                border-gray-600 hover:border-gray-500
                ${errors.role ? "border-red-400 focus:border-red-400 focus:ring-red-500/50" : ""}
              `}
            >
              <option value="" disabled>
                Selecione uma opção
              </option>
              <option value="cliente">Cliente</option>
              <option value="admin" disabled={isAdminDisabled}>
                Administrador
              </option>
            </select>

            {errors.role && (
              <motion.p 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-400 flex items-center gap-1"
              >
                <span className="w-1 h-1 bg-red-400 rounded-full" />
                {errors.role.message}
              </motion.p>
            )}

            {isAdminDisabled && (
              <p className="mt-2 text-sm text-yellow-400 text-center">
                ⚠️ O acesso de administrador está temporariamente desativado.
              </p>
            )}
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <RingLoader color="#ffffff" size={50} />
            </div>
          ) : (
            <button
              type="submit"
              className="bg-zinc-800 w-full text-sm hover:bg-zinc-900 rounded-md text-white py-3 font-medium transition duration-300 transform hover:scale-105"
            >
              Cadastrar
            </button>
          )}
          {message && (
            <>
              <p
                className={`text-center mt-2 ${
                  message.includes("E-mail verificado!") ||
                  message.includes("Cadastro efetuado com Google!") ||
                  message.includes("Bem-vindo(a) a Feira Livre de Buritizeiro")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {message}
              </p>
            </>
          )}

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-200">ou</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={handleGoogleLogin}
              className="bg-red-500 text-white text-sm rounded-md px-2 py-3 flex items-center justify-center gap-2"
            >
              <FaGoogle size={20} /> Entrar com Google
            </button>
            <Link
              to="/Login"
              className="text-white inline-block mt-4 text-sm text-center hover:bg-zinc-500 py-3 px-2 rounded-md transition duration-300 ease-in-out"
            >
              Já possui uma conta? Conecte-se.
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
    </div>
  );
};

export default Registro;
