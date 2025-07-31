import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

const ThemeToggleEnhanced = ({ variant = 'button', className = '' }) => {
  const { isDark, toggleTheme } = useTheme();

  // Variante botão (estilo original melhorado)
  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        className={`
          group relative inline-flex items-center justify-center w-10 h-10 rounded-xl
          bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm
          hover:bg-white/20 dark:hover:bg-gray-700/50
          transition-all duration-500 ease-out transform hover:scale-110
          focus:outline-none
          shadow-lg hover:shadow-xl
          ${className}
        `}
        aria-label={isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
      >
        {/* Efeito de fundo sutil no hover */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/10 to-orange-500/10 dark:from-blue-400/10 dark:to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Efeito de brilho sutil */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-300/20 to-orange-400/20 dark:from-blue-300/20 dark:to-purple-400/20 opacity-0 group-hover:opacity-100 transition-all duration-700 blur-sm" />
        
        {/* Container dos ícones */}
        <div className="relative w-5 h-5 z-10">
          {/* Ícone do Sol */}
          <Sun
            className={`
              absolute inset-0 w-5 h-5 text-yellow-400 drop-shadow-lg
              transition-all duration-700 ease-out
              ${isDark 
                ? 'opacity-0 rotate-90 scale-0 translate-y-2' 
                : 'opacity-100 rotate-0 scale-100 translate-y-0'
              }
            `}
          />
          
          {/* Ícone da Lua */}
          <Moon
            className={`
              absolute inset-0 w-5 h-5 text-blue-300 drop-shadow-lg
              transition-all duration-700 ease-out
              ${isDark 
                ? 'opacity-100 rotate-0 scale-100 translate-y-0' 
                : 'opacity-0 -rotate-90 scale-0 -translate-y-2'
              }
            `}
          />
        </div>

        {/* Efeito de partículas sutis */}
        <div className="absolute inset-0 rounded-xl overflow-hidden">
          <div className={`
            absolute top-1 left-1 w-1 h-1 bg-yellow-400/60 rounded-full
            transition-all duration-1000 ease-out
            ${isDark ? 'opacity-0 scale-0' : 'opacity-100 scale-100 animate-pulse'}
          `} />
          <div className={`
            absolute top-2 right-2 w-0.5 h-0.5 bg-orange-400/60 rounded-full
            transition-all duration-1000 ease-out delay-200
            ${isDark ? 'opacity-0 scale-0' : 'opacity-100 scale-100 animate-pulse'}
          `} />
          <div className={`
            absolute bottom-1 left-2 w-0.5 h-0.5 bg-blue-300/60 rounded-full
            transition-all duration-1000 ease-out delay-400
            ${isDark ? 'opacity-100 scale-100 animate-pulse' : 'opacity-0 scale-0'}
          `} />
          <div className={`
            absolute bottom-2 right-1 w-1 h-1 bg-purple-300/60 rounded-full
            transition-all duration-1000 ease-out delay-600
            ${isDark ? 'opacity-100 scale-100 animate-pulse' : 'opacity-0 scale-0'}
          `} />
        </div>
      </button>
    );
  }

  // Variante switch (estilo alternativo)
  return (
    <button
      onClick={toggleTheme}
      className={`
        group relative inline-flex items-center justify-center w-12 h-6 rounded-full
        bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-blue-500 to-purple-600
        transition-all duration-700 ease-out transform hover:scale-105
        focus:outline-none
        shadow-lg hover:shadow-xl
        ${className}
      `}
      aria-label={isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
    >
      {/* Efeito de fundo sutil no hover */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300/20 to-orange-400/20 dark:from-blue-300/20 dark:to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Switch interno */}
      <div className={`
        absolute left-1 w-4 h-4 bg-white rounded-full shadow-lg z-10
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

      {/* Efeito de brilho sutil no switch */}
      <div className={`
        absolute left-1 w-4 h-4 rounded-full bg-white/30
        transition-all duration-700 ease-out transform
        ${isDark ? 'translate-x-6 opacity-0' : 'translate-x-0 opacity-100'}
      `} />

      {/* Partículas decorativas sutis */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className={`
          absolute top-0.5 left-2 w-0.5 h-0.5 bg-yellow-300/60 rounded-full
          transition-all duration-1000 ease-out
          ${isDark ? 'opacity-0 scale-0' : 'opacity-100 scale-100 animate-pulse'}
        `} />
        <div className={`
          absolute bottom-0.5 right-2 w-0.5 h-0.5 bg-orange-300/60 rounded-full
          transition-all duration-1000 ease-out delay-200
          ${isDark ? 'opacity-0 scale-0' : 'opacity-100 scale-100 animate-pulse'}
        `} />
        <div className={`
          absolute top-0.5 right-1 w-0.5 h-0.5 bg-blue-300/60 rounded-full
          transition-all duration-1000 ease-out delay-400
          ${isDark ? 'opacity-100 scale-100 animate-pulse' : 'opacity-0 scale-0'}
        `} />
        <div className={`
          absolute bottom-0.5 left-1 w-0.5 h-0.5 bg-purple-300/60 rounded-full
          transition-all duration-1000 ease-out delay-600
          ${isDark ? 'opacity-100 scale-100 animate-pulse' : 'opacity-0 scale-0'}
        `} />
      </div>
    </button>
  );
};

export default ThemeToggleEnhanced; 