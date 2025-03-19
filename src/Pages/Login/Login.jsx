import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import logo1 from '../../assets/logo1.png';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../../components/Input';
import fundo from '../../assets/fundo.jpg';
import { signInWithEmailAndPassword, signOut, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../services/firebaseConnection';
import { FaGoogle } from 'react-icons/fa';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConnection';
import { AuthContext } from '../../contexts/AuthContext';

const schema = z.object({
  email: z.string().email("Insira um email válido").nonempty("O campo email é obrigatório"),
  password: z.string().nonempty("O campo senha é obrigatório")
});

const Login = () => {
  const { handleInfoUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange"
  });

  const [message, setMessage] = useState("");
  const [lastLoggedInEmail, setLastLoggedInEmail] = useState("");
  const [isResendDisabled] = useState(false);
  const [isGoogleLogin, setIsGoogleLogin] = useState(false); // Novo estado para verificar se é login pelo Google
  const [errorMessages, setErrorMessages] = useState({ email: '', password: '' }); // Estado para mensagens de erro

  useEffect(() => {
    async function handleLogout() {
      await signOut(auth);
    }

    handleLogout();
    const lastEmail = localStorage.getItem('lastLoggedInEmail');
    if (lastEmail) {
      setLastLoggedInEmail(lastEmail);
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;
  
      setMessage("Login efetuado com sucesso!");
      localStorage.setItem('lastLoggedInEmail', data.email);
      setLastLoggedInEmail(data.email);
  
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
  
      handleInfoUser({
        name: user.displayName || 'Nome não definido',
        email: user.email,
        uid: user.uid,
        role: userData.role || 'cliente',
      });
  
     
      setErrorMessages({ email: '', password: '' });
      reset(); 

      navigate("/paginaprincipal", { replace: true });
    } catch (error) {
      setMessage("Erro ao fazer o login. Por favor, verifique suas credenciais.");
    }
  };
  
  const handleGoogleLogin = async () => {
    setIsGoogleLogin(true); 
    setErrorMessages({ email: '', password: '' }); 
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
          photoURL: user.photoURL || "",  // Salva a foto de perfil
          role: "cliente" 
        });
        setMessage("Login efetuado com Google! Bem-vindo(a) a Feira Livre de Buritizeiro.");
      } else {
        const userData = userDoc.data();
        handleInfoUser({
          name: user.displayName,
          email: user.email,
          uid: user.uid,
          role: userData.role || 'cliente',
          photoURL: userData.photoURL || '', // Acessa a foto de perfil salva no Firestore
        });
  
        setMessage("Bem-vindo(a) de volta!");
      }
  
      setErrorMessages({ email: '', password: '' });
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
    <div className="relative bg-cover bg-no-repeat bg-center h-full" style={{ backgroundImage: `url(${fundo})` }}>
      <div className="w-full min-h-screen flex justify-center items-center flex-col gap-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}>
       
       {/* Logo e Título */}
       <Link to="/" className="max-w-sm w-full flex flex-col items-center mt-8">
          <img src={logo1} alt="Logo" className="w-40 mx-auto animate-bounce" />
          <h1 className="text-2xl uppercase text-white mb-1 font-extrabold tracking-wide">Viva Bem</h1>
          <h3 className="text-sm text-gray-300 font-semibold ">Buritizeiro</h3>
        </Link>

        <form className="bg-white max-w-md w-full bg-opacity-10 text-sm backdrop-blur-md rounded-lg p-8 shadow-lg" onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-center mb-6 text-gray-200 font-bold text-xl">LOGIN</h1>
              <div className="mb-4">
                <Input
                  type="email"
                  placeholder="Digite seu email..."
                  name="email"
                  value={lastLoggedInEmail}
                  onChange={(e) => setLastLoggedInEmail(e.target.value)}
                  error={!isGoogleLogin && errors.email?.message} 
                  register={register}
                />
                {errorMessages.email && <p className="text-red-500">{errorMessages.email}</p>}
              </div>

              <div className="mb-4">
                <Input
                  type="password"
                  placeholder="Digite sua senha..."
                  name="password"
                  error={!isGoogleLogin && errors.password?.message}
                  register={register}
                />
                {errorMessages.password && <p className="text-red-500">{errorMessages.password}</p>}
              </div>

              <button type="submit" className="bg-zinc-800 w-full hover:bg-zinc-900 rounded-md text-white h-10 font-medium transition duration-300 transform hover:scale-105">
                    Acessar
              </button>

              {message && (
                <p className={`text-center mt-2 
                  ${message.includes("sucesso") ? 'text-green-400' : 
                    message.includes("Google! Bem-vindo") || message.includes("Bem-vindo(a) de volta!") ? 'text-green-400' : 'text-red-400'}`}>
                  {message}
                </p>
              )}

              {message.includes("verifique seu e-mail") && (
                <button 
                  type="button" 
                  className={`text-blue-500 mt-2 ${isResendDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isResendDisabled} 
                >
                  {isResendDisabled ? 'Reenviando...' : 'Reenviar e-mail de verificação'}
                </button>
              )}
              <div className="flex flex-col gap-2 mt-4">
                  <button 
                      onClick={handleGoogleLogin} 
                      className="bg-red-500 text-white text-sm rounded-md px-2 py-2 flex items-center justify-center gap-2"
                    >
                      <FaGoogle size={20} /> Entrar com Google
                  </button>
                  <Link to="/Registro" className="text-white inline-block text-xs text-center hover:bg-zinc-500 py-2 px-2 rounded-md transition duration-300 ease-in-out">
                  Ainda não possui uma conta? Cadastre-se.
                  </Link>
                </div>
        </form>
          <div className="flex flex-col gap-2">
              <Link to="/" className="text-white text-xs hover:bg-zinc-500 rounded-md py-2 px-2 text-center transition duration-300 ease-in-out">
                Voltar ao Início
              </Link>
          </div>
      </div>
    </div>
  );
};

export default Login;
