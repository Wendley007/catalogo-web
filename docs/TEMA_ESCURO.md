# 🌙 Tema Escuro - Documentação

## 📋 Visão Geral

O projeto agora possui suporte completo ao tema escuro, permitindo que os usuários alternem entre tema claro e escuro. O sistema é baseado no Tailwind CSS e utiliza classes condicionais para aplicar estilos diferentes baseados no tema ativo.

## 🚀 Funcionalidades

- ✅ **Toggle automático** entre tema claro e escuro
- ✅ **Persistência** da preferência no localStorage
- ✅ **Respeita preferência do sistema** (prefers-color-scheme)
- ✅ **Transições suaves** entre temas
- ✅ **Componentes responsivos** que se adaptam automaticamente
- ✅ **Hook personalizado** para facilitar o uso

## 🛠️ Como Usar

### 1. Contexto do Tema

O tema é gerenciado através do `ThemeContext` que já está configurado no `App.jsx`:

```jsx
import { ThemeProvider } from "./contexts/ThemeContext";

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Rotas />
      </BrowserRouter>
    </ThemeProvider>
  );
};
```

### 2. Hook Personalizado

Use o hook `useThemeToggle` para acessar as funcionalidades do tema:

```jsx
import { useThemeToggle } from '../hooks/useThemeToggle';

const MeuComponente = () => {
  const { isDark, toggle, setSpecificTheme, theme } = useThemeToggle();

  return (
    <div>
      <p>Tema atual: {isDark ? 'Escuro' : 'Claro'}</p>
      <button onClick={toggle}>Alternar Tema</button>
      <button onClick={() => setSpecificTheme('light')}>Tema Claro</button>
      <button onClick={() => setSpecificTheme('dark')}>Tema Escuro</button>
    </div>
  );
};
```

### 3. Classes CSS

Use as classes do Tailwind CSS com prefixo `dark:` para estilos específicos do tema escuro:

```jsx
// Exemplo de card com tema escuro
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
  <h2 className="text-gray-900 dark:text-gray-100 font-bold">
    Título
  </h2>
  <p className="text-gray-600 dark:text-gray-400">
    Descrição
  </p>
</div>
```

## 🎨 Classes Comuns

### Cores de Fundo
```css
bg-white dark:bg-gray-800          /* Fundo principal */
bg-gray-50 dark:bg-gray-700        /* Fundo secundário */
bg-gray-100 dark:bg-gray-600       /* Fundo terciário */
```

### Cores de Texto
```css
text-gray-900 dark:text-gray-100   /* Texto principal */
text-gray-600 dark:text-gray-400   /* Texto secundário */
text-gray-500 dark:text-gray-500   /* Texto neutro */
```

### Bordas
```css
border-gray-200 dark:border-gray-700    /* Borda padrão */
border-gray-300 dark:border-gray-600    /* Borda de input */
```

### Botões
```css
bg-blue-500 hover:bg-blue-600 text-white                    /* Botão primário */
bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300  /* Botão secundário */
border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300  /* Botão outline */
```

## 🔧 Componentes Configurados

### ✅ Já configurados:
- **MenuTopo** - Header com toggle de tema
- **MenuMobile** - Menu lateral com suporte ao tema
- **BancaCard** - Cards de bancas com tema escuro
- **Footer** - Rodapé já adaptado
- **HeroSection** - Seção hero (já funcionava bem)

### 🔄 Para configurar:
- Outros componentes podem precisar de ajustes
- Use o padrão de classes mostrado acima

## 📱 Toggle de Tema

O toggle de tema está disponível em:
- **Desktop**: No menu superior, entre o status da feira e a navegação
- **Mobile**: No menu lateral, no cabeçalho junto ao botão de fechar

## 🎯 Exemplo Prático

```jsx
import { useThemeToggle } from '../hooks/useThemeToggle';

const ExemploComponente = () => {
  const { isDark, toggle } = useThemeToggle();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Meu Componente
        </h2>
        <button
          onClick={toggle}
          className="p-2 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400">
        Este componente se adapta automaticamente ao tema.
      </p>
      
      <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Área destacada
        </span>
      </div>
    </div>
  );
};
```

## 🔍 Debugging

Para verificar se o tema está funcionando:

1. **Inspecionar elemento**: Verifique se a classe `dark` está presente no `<html>`
2. **Console**: `localStorage.getItem('theme')` deve retornar 'light' ou 'dark'
3. **Preferência do sistema**: O tema inicial respeita `prefers-color-scheme`

## 🚨 Problemas Comuns

### Tema não muda
- Verifique se o `ThemeProvider` está envolvendo a aplicação
- Confirme se as classes `dark:` estão sendo aplicadas
- Verifique se não há CSS customizado sobrescrevendo

### Flash de tema incorreto
- O tema é aplicado via JavaScript, pode haver um flash inicial
- Considere usar `next-themes` para projetos Next.js

### Componentes não se adaptam
- Adicione classes `dark:` aos componentes
- Use o padrão de cores mostrado na documentação

## 📚 Recursos Adicionais

- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [CSS prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [React Context API](https://reactjs.org/docs/context.html)

## 🤝 Contribuindo

Ao adicionar novos componentes:

1. Use sempre classes `dark:` para cores
2. Teste em ambos os temas
3. Mantenha consistência com o padrão estabelecido
4. Documente mudanças significativas

---

**Nota**: O tema escuro está totalmente funcional e pode ser usado imediatamente. Todos os componentes principais já foram adaptados. 