import { useThemeToggle } from '../hooks/useThemeToggle';
import { Sun, Moon, Palette, Eye, EyeOff } from 'lucide-react';

const ThemeDemo = () => {
  const { isDark, toggle, setSpecificTheme, theme } = useThemeToggle();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-green-600 to-blue-800 dark:from-gray-100 dark:via-green-400 dark:to-blue-400 bg-clip-text text-transparent mb-2">
          Demonstração de Tema
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Teste as funcionalidades do tema escuro
        </p>
      </div>

      {/* Status atual do tema */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center space-x-3">
          {isDark ? (
            <Moon className="text-blue-400" size={24} />
          ) : (
            <Sun className="text-yellow-500" size={24} />
          )}
          <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Tema atual: {isDark ? 'Escuro' : 'Claro'}
          </span>
        </div>
      </div>

      {/* Controles do tema */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Toggle automático */}
        <button
          onClick={toggle}
          className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          <Palette size={20} />
          <span>Alternar Tema</span>
        </button>

        {/* Definir tema claro */}
        <button
          onClick={() => setSpecificTheme('light')}
          className={`flex items-center justify-center space-x-2 p-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
            !isDark
              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
          }`}
        >
          <Sun size={20} />
          <span>Tema Claro</span>
        </button>

        {/* Definir tema escuro */}
        <button
          onClick={() => setSpecificTheme('dark')}
          className={`flex items-center justify-center space-x-2 p-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
            isDark
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
          }`}
        >
          <Moon size={20} />
          <span>Tema Escuro</span>
        </button>
      </div>

      {/* Exemplos de componentes */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Exemplos de Componentes
        </h4>

        {/* Cards de exemplo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
            <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              Card de Exemplo
            </h5>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Este é um exemplo de como os componentes se adaptam ao tema escuro.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm">
            <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
              Card com Sombra
            </h5>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Cards com sombras também se adaptam automaticamente.
            </p>
          </div>
        </div>

        {/* Botões de exemplo */}
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors">
            Botão Primário
          </button>
          <button className="px-4 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
            Botão Secundário
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
            Botão Outline
          </button>
        </div>

        {/* Input de exemplo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Campo de Exemplo
          </label>
          <input
            type="text"
            placeholder="Digite algo aqui..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Informações */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <Eye className="text-blue-500 mt-1" size={20} />
          <div>
            <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
              Como funciona
            </h5>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              O tema é salvo automaticamente no localStorage e respeita a preferência do sistema. 
              Use o toggle no menu superior para alternar entre os temas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeDemo; 