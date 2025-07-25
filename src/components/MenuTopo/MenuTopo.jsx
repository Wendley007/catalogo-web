import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Menu, 
  X, 
  Home, 
  Info, 
  MapPin, 
  Settings 
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import CountdownTimer from "./CountdownTimer";
import UserMenu from "./UserMenu";
import logo1 from "../../assets/logo1.png";

/**
 * Componente para item do menu de navegação
 */
const MenuItem = ({ to, icon: Icon, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-white/10 text-white"
          : "text-white/75 hover:text-white hover:bg-white/10"
      }`}
    >
      <Icon size={18} />
      <span>{children}</span>
    </Link>
  );
};

/**
 * Menu lateral para mobile
 */
const MobileMenu = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  const menuItems = [
    { to: "/paginaprincipal", icon: Home, label: "Início" },
    { to: "/historia", icon: Info, label: "História" },
    { to: "/localizacao", icon: MapPin, label: "Localização" },
    ...(user?.role === "admin"
      ? [{ to: "/admin", icon: Settings, label: "Admin" }]
      : []),
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />
      
      {/* Menu lateral */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        exit={{ x: -300 }}
        className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-emerald-700 to-green-800 z-50 lg:hidden"
      >
        <div className="flex flex-col h-full">
          {/* Header do menu */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <Link to="/" onClick={onClose}>
              <img src={logo1} alt="Logo" className="h-10 w-auto" />
            </Link>
            <button
              onClick={onClose}
              className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Countdown Timer */}
          <div className="p-4 border-b border-white/10">
            <CountdownTimer />
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <MenuItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  onClick={onClose}
                >
                  {item.label}
                </MenuItem>
              ))}
            </div>
          </nav>

          {/* User Menu */}
          <div className="p-4 border-t border-white/10">
            <UserMenu />
          </div>
        </div>
      </motion.div>
    </>
  );
};

/**
 * Componente principal do MenuTopo refatorado
 */
const MenuTopo = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const menuItems = [
    { to: "/paginaprincipal", icon: Home, label: "Início" },
    { to: "/historia", icon: Info, label: "História" },
    { to: "/localizacao", icon: MapPin, label: "Localização" },
    ...(user?.role === "admin"
      ? [{ to: "/admin", icon: Settings, label: "Admin" }]
      : []),
  ];

  return (
    <>
      <header className="bg-gradient-to-r from-emerald-700 via-green-600 to-green-700 shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <motion.img
                src={logo1}
                alt="Logo"
                className="h-10 w-auto"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
              <div className="hidden sm:block">
                <h1 className="text-white font-bold text-lg">
                  Feira de Buritizeiro
                </h1>
                <p className="text-white/75 text-xs">
                  Produtos frescos e locais
                </p>
              </div>
            </Link>

            {/* Countdown Timer - Desktop */}
            <div className="hidden md:block">
              <CountdownTimer />
            </div>

            {/* Menu Desktop */}
            <nav className="hidden lg:flex items-center space-x-1">
              {menuItems.map((item) => (
                <MenuItem
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                >
                  {item.label}
                </MenuItem>
              ))}
            </nav>

            {/* User Menu - Desktop */}
            <div className="hidden lg:block">
              <UserMenu />
            </div>

            {/* Menu Mobile Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Menu Mobile */}
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};

export default MenuTopo;