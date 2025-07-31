import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggleSwitch = ({ className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        group relative inline-flex items-center justify-center w-12 h-6 rounded-full
        bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-blue-500 to-purple-600
        transition-all duration-700 ease-out transform hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2
        dark:focus:ring-offset-gray-800 shadow-lg hover:shadow-xl
        ${className}
      `}
      aria-label={isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
    >
      {/* Efeito de fundo animado */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300/30 to-orange-400/30 dark:from-blue-300/30 dark:to-purple-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Switch interno */}
      <div className={`
        absolute left-1 w-4 h-4 bg-white rounded-full shadow-lg
        transition-all duration-700 ease-out transform
        ${isDark ? 'translate-x-6' : 'translate-x-0'}
      `}>
        {/* Ícone dentro do switch */}
        <div className="relative w-full h-full flex items-center justify-center">
          <Sun
            className={`
              w-2.5 h-2.5 text-yellow-500 transition-all duration-700 ease-out
              ${isDark ? 'opacity-0 scale-0 rotate-90' : 'opacity-100 scale-100 rotate-0'}
            `}
          />
          <Moon
            className={`
              absolute inset-0 w-2.5 h-2.5 text-blue-600 transition-all duration-700 ease-out
              ${isDark ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 -rotate-90'}
            `}
          />
        </div>
      </div>

      {/* Efeito de brilho no switch */}
      <div className={`
        absolute left-1 w-4 h-4 rounded-full bg-white/50
        transition-all duration-700 ease-out transform
        ${isDark ? 'translate-x-6 opacity-0' : 'translate-x-0 opacity-100'}
      `} />

      {/* Partículas decorativas */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className={`
          absolute top-0.5 left-2 w-0.5 h-0.5 bg-yellow-300 rounded-full
          transition-all duration-1000 ease-out
          ${isDark ? 'opacity-0 scale-0' : 'opacity-100 scale-100 animate-pulse'}
        `} />
        <div className={`
          absolute bottom-0.5 right-2 w-0.5 h-0.5 bg-orange-300 rounded-full
          transition-all duration-1000 ease-out delay-200
          ${isDark ? 'opacity-0 scale-0' : 'opacity-100 scale-100 animate-pulse'}
        `} />
        <div className={`
          absolute top-0.5 right-1 w-0.5 h-0.5 bg-blue-300 rounded-full
          transition-all duration-1000 ease-out delay-400
          ${isDark ? 'opacity-100 scale-100 animate-pulse' : 'opacity-0 scale-0'}
        `} />
        <div className={`
          absolute bottom-0.5 left-1 w-0.5 h-0.5 bg-purple-300 rounded-full
          transition-all duration-1000 ease-out delay-600
          ${isDark ? 'opacity-100 scale-100 animate-pulse' : 'opacity-0 scale-0'}
        `} />
      </div>

      {/* Efeito de borda animada */}
      <div className={`
        absolute inset-0 rounded-full border-2 border-transparent
        bg-gradient-to-r from-yellow-300 to-orange-400 dark:from-blue-300 dark:to-purple-400
        bg-clip-border opacity-0 group-hover:opacity-100
        transition-all duration-500 ease-out
      `} />
    </button>
  );
};

export default ThemeToggleSwitch; 