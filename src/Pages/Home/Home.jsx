import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";
import SEO from "../../components/SEO/SEO";
import HeroSection from "../../components/HeroSection/HeroSection";
import { Users, ShoppingBag, Heart, Award } from "lucide-react";
import fundo from "../../assets/fundo.jpg";
import logo1 from "../../assets/logo1.png";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function handleLogout() {
      await signOut(auth);
      setLoading(false);
    }

    handleLogout();
  }, []);

  // Dados das estatísticas
  const stats = [
    {
      icon: Users,
      value: "40+",
      label: "Anos de Tradição",
    },
    {
      icon: ShoppingBag,
      value: "32",
      label: "Boxes Disponíveis",
    },
    {
      icon: Award,
      value: "100%",
      label: "Produtos Locais",
    },
    {
      icon: Heart,
      value: "10000+",
      label: "Famílias Atendidas",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-600 to-green-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Feira Livre de Buritizeiro - Viva Bem"
        description="Bem-vindo à Feira Livre de Buritizeiro. Descubra produtos frescos e de qualidade em um ambiente tradicional e acolhedor. Mais de 40 anos de tradição no coração da cidade."
        keywords={[
          "feira",
          "buritizeiro",
          "produtos frescos",
          "hortifruti",
          "tradição",
          "mercado municipal",
          "produtos locais",
        ]}
        image="/logo.png"
        url={window.location.href}
        type="website"
      />

      <main className="min-h-screen">
        <HeroSection
          title="Viva Bem"
          subtitle="Buritizeiro"
          description="Descubra produtos frescos e de alta qualidade diretamente da nossa comunidade local. Mais de 40 anos de tradição no coração de Buritizeiro."
          backgroundImage={fundo}
          logo={logo1}
          stats={stats}
          showQuickInfo={true}
          primaryButton={{
            text: "Explorar Feira",
            to: "/paginaprincipal",
          }}
          secondaryButton={{
            text: "Área do Vendedor",
            to: "/bancas/",
          }}
        />
      </main>
    </>
  );
};

export default Home;
