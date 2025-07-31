import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { onAuthStateChanged, updateProfile, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../services/firebaseConnection";

const AuthContext = createContext({
  signed: false,
  loadingAuth: true,
  handleInfoUser: () => {},
  user: null,
  handleLogout: () => {},
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        const userData = userDoc.exists() ? userDoc.data() : {};

        const userInfo = {
          uid: user.uid,
          name: user.displayName || "Nome não definido",
          email: user.email,
          photoURL: userData.photoURL || user.photoURL || "",
          role: userData.role || "cliente",
        };
        console.log('AuthStateChanged - Usuário carregado:', userInfo);
        setUser(userInfo);
      } else {
        setUser(null);
      }
      setLoadingAuth(false);
    });

    return () => {
      unsub();
    };
  }, []);

  const handleInfoUser = ({ name, email, uid, role, photoURL }) => {
    console.log('Atualizando usuário:', { name, email, uid, role, photoURL });
    setUser({
      uid,
      name,
      email,
      photoURL, // Atualizando também a foto
      role,
    });
  };

  const updateUserProfile = async (updates) => {
    if (auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, updates);
        setUser((prevUser) => ({
          ...prevUser,
          name: auth.currentUser.displayName,
          photoURL: auth.currentUser.photoURL, // Atualizando a foto
        }));
      } catch (error) {
        console.error("Erro ao atualizar perfil do usuário:", error);
        throw error;
      }
    } else {
      throw new Error("Nenhum usuário autenticado");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log("Deslogado com sucesso");
    } catch (error) {
      console.error("Erro ao deslogar:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        loadingAuth,
        handleInfoUser,
        user,
        updateUserProfile,
        signOut: handleLogout,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AuthContext, AuthProvider };
