# Configuração do Vite

Este documento explica as configurações do `vite.config.js` para o projeto da Feira de Buritizeiro.

## 🚀 Configurações Principais

### **Servidor de Desenvolvimento**
```javascript
server: {
  port: 5173,           // Porta padrão
  host: true,           // Permite acesso externo
  open: true,           // Abre navegador automaticamente
  cors: true,           // Habilita CORS
}
```

### **Build de Produção**
```javascript
build: {
  outDir: 'dist',       // Diretório de saída
  sourcemap: true,      // Gera source maps para debug
  minify: 'terser',     // Minificação otimizada
  chunkSizeWarningLimit: 1000, // Limite de aviso de tamanho
}
```

## 📁 Aliases de Importação

Para facilitar as importações, foram configurados aliases:

```javascript
resolve: {
  alias: {
    '@': resolve(__dirname, 'src'),
    '@components': resolve(__dirname, 'src/components'),
    '@pages': resolve(__dirname, 'src/Pages'),
    '@assets': resolve(__dirname, 'src/assets'),
    '@services': resolve(__dirname, 'src/services'),
    '@contexts': resolve(__dirname, 'src/contexts'),
  },
}
```

### **Como usar os aliases:**

```javascript
// Antes
import BancaCard from '../../components/BancaCard/BancaCard';
import { db } from '../../services/firebaseConnection';

// Depois
import BancaCard from '@components/BancaCard/BancaCard';
import { db } from '@services/firebaseConnection';
```

## 🧩 Code Splitting

O Vite separa automaticamente os chunks para melhor performance:

```javascript
manualChunks: {
  vendor: ['react', 'react-dom'],
  firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth', 'firebase/storage'],
  ui: ['framer-motion', 'lucide-react', 'react-icons'],
}
```

### **Benefícios:**
- **Cache otimizado** - Chunks separados são cacheados independentemente
- **Carregamento mais rápido** - Apenas o necessário é baixado
- **Melhor performance** - Reduz o tamanho inicial do bundle

## 🎨 Otimizações de CSS

```javascript
css: {
  devSourcemap: true, // Source maps para CSS em desenvolvimento
}
```

## 📦 Assets

```javascript
assetsInclude: ['**/*.woff2', '**/*.woff', '**/*.ttf', '**/*.eot']
```

Inclui fontes como assets para melhor tratamento.

## 🔧 Variáveis Globais

```javascript
define: {
  __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
}
```

Permite usar `__APP_VERSION__` no código para acessar a versão do app.

## ⚡ Configurações de Performance

### **ESBuild**
```javascript
esbuild: {
  jsxInject: `import React from 'react'`, // Injeção automática do React
}
```

### **Preview**
```javascript
preview: {
  port: 4173,
  host: true,
}
```

## 📋 Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Gera build de produção
npm run preview      # Preview do build de produção

# Lint
npm run lint         # Executa ESLint
```

## 🎯 Benefícios das Configurações

### ✅ **Desenvolvimento**
- Hot reload rápido
- Source maps para debug
- Aliases para importações limpas
- Abertura automática do navegador

### ✅ **Produção**
- Build otimizado
- Code splitting inteligente
- Minificação eficiente
- Cache otimizado

### ✅ **Performance**
- Chunks separados por categoria
- Assets otimizados
- CSS com source maps
- Fontes tratadas corretamente

## 🔄 Migração de Importações

Para usar os novos aliases, você pode atualizar gradualmente:

```javascript
// Exemplo de migração
// Antes
import MenuTopo from '../../components/MenuTopo';
import { AuthContext } from '../../contexts/AuthContext';

// Depois
import MenuTopo from '@components/MenuTopo';
import { AuthContext } from '@contexts/AuthContext';
```

## 🚨 Considerações

1. **Compatibilidade** - Os aliases funcionam apenas com Vite
2. **TypeScript** - Se usar TS, configure também no `tsconfig.json`
3. **IDE** - Configure seu editor para reconhecer os aliases

## 📈 Monitoramento

Use as ferramentas de desenvolvimento do navegador para:
- Verificar o tamanho dos chunks
- Analisar o tempo de carregamento
- Monitorar o cache dos assets 