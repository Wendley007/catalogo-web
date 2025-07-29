import { useState, useContext, useCallback, useMemo } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Menu, Home, Info, MapPin, Settings, Clock } from "lucide-react";
import { useFeiraStatus } from "./hooks";
import Logo from "./Logo";
import FeiraStatus from "./ContagemRegressiva";
import MenuDesktop from "./MenuDesktop";
import MenuMobile from "./MenuMobile";

/**
 * Componente principal do MenuTopo
 */
const MenuTopo = () => {
  const { timeRemaining, feiraAberta } = useFeiraStatus();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user } = useContext(AuthContext);

  // Define os itens do menu baseado no papel do usuário
  const menuItems = useMemo(
    () => [
      { to: "/paginaprincipal", icon: Home, label: "Início" },
      { to: "/historia", icon: Info, label: "História" },
      { to: "/localizacao", icon: MapPin, label: "Localização" },
      ...(user?.role === "admin"
        ? [{ to: "/admin", icon: Settings, label: "Admin" }]
        : []),
    ],
    [user?.role]
  );

  const toggleMobileMenu = useCallback(
    () => setIsMobileMenuOpen((prev) => !prev),
    []
  );
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
  const toggleUserMenu = useCallback(
    () => setIsUserMenuOpen((prev) => !prev),
    []
  );

  return (
    <>
      <header className="bg-gradient-to-r from-emerald-700 via-green-600 to-green-700 shadow-lg sticky top-0 z-40">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo />

            {/* Status da Feira */}
            <div className="hidden md:block">
              <FeiraStatus
                feiraAberta={feiraAberta}
                timeRemaining={timeRemaining}
              />
            </div>

            {/* Status da Feira Mobile */}
            <div className="md:hidden">
              <div className="flex items-center space-x-2">
                <Clock className="text-white" size={16} aria-hidden="true" />
                <span className="text-white text-xs font-medium">
                  {feiraAberta ? "Aberta" : "Fechada"}
                </span>
              </div>
            </div>

            {/* Navegação Desktop */}
            <MenuDesktop
              menuItems={menuItems}
              user={user}
              isUserMenuOpen={isUserMenuOpen}
              toggleUserMenu={toggleUserMenu}
            />

            {/* Botão do menu mobile */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Abrir menu de navegação"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu size={24} aria-hidden="true" />
            </button>
          </div>
        </section>
      </header>

      {/* Menu Mobile */}
      <MenuMobile
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        menuItems={menuItems}
      />
    </>
  );
};

export default MenuTopo; 