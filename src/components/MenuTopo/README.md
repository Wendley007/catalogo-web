# MenuTopo - Estrutura Modular

Este diretório contém os componentes modulares do MenuTopo, organizados de forma a facilitar a manutenção e reutilização.

## 📁 Estrutura de Arquivos

```
MenuTopo/
├── hooks.js              # Hooks customizados
├── Logo.jsx              # Componente do logo
├── ContagemRegressiva.jsx # Componente de contagem regressiva
├── MenuDesktop.jsx       # Menu de navegação desktop
├── MenuMobile.jsx        # Menu lateral mobile
├── MenuTopo.jsx          # Componente principal (orquestrador)
├── index.js              # Arquivo de exportações
└── README.md             # Esta documentação
```

## 🧩 Componentes

### 1. **hooks.js**
Contém os hooks customizados utilizados pelos componentes:
- `useFeiraStatus()`: Gerencia o status da feira e contagem regressiva
- `useUserMenu()`: Gerencia o estado do menu do usuário

### 2. **Logo.jsx**
Componente responsável por exibir o logo da aplicação com animações.

### 3. **ContagemRegressiva.jsx**
Componente que exibe o status da feira e a contagem regressiva para a próxima abertura.

### 4. **MenuDesktop.jsx**
Menu de navegação para dispositivos desktop, incluindo:
- Itens de navegação
- Menu do usuário com funcionalidades de edição de perfil
- Estados de login/logout

### 5. **MenuMobile.jsx**
Menu lateral para dispositivos móveis, incluindo:
- Sidebar com animações
- Itens de navegação
- Área do usuário
- Backdrop com blur

### 6. **MenuTopo.jsx**
Componente principal que orquestra todos os outros componentes e gerencia o estado geral.

## 🔧 Como Usar

### Importação Simples (Recomendado)
```jsx
import MenuTopo from '../components/MenuTopo/MenuTopo';
```

### Importação de Componentes Específicos
```jsx
import { Logo, FeiraStatus, MenuDesktop, MenuMobile } from '../components/MenuTopo';
```

### Importação de Hooks
```jsx
import { useFeiraStatus, useUserMenu } from '../components/MenuTopo';
```

### Importação Direta dos Arquivos
```jsx
// Para importar diretamente de um arquivo específico
import Logo from '../components/MenuTopo/Logo';
import FeiraStatus from '../components/MenuTopo/ContagemRegressiva';
import MenuDesktop from '../components/MenuTopo/MenuDesktop';
import MenuMobile from '../components/MenuTopo/MenuMobile';
import { useFeiraStatus, useUserMenu } from '../components/MenuTopo/hooks';
```

## 🎯 Benefícios da Modularização

1. **Manutenibilidade**: Cada componente tem uma responsabilidade específica
2. **Reutilização**: Componentes podem ser usados independentemente
3. **Testabilidade**: Facilita a criação de testes unitários
4. **Organização**: Código mais limpo e organizado
5. **Performance**: Permite otimizações específicas por componente

## 🔄 Fluxo de Dados

```
MenuTopo (Principal)
├── useFeiraStatus() → ContagemRegressiva
├── useUserMenu() → MenuDesktop
├── Logo
├── MenuDesktop
│   ├── MenuItem
│   └── UserMenu
└── MenuMobile
    └── Itens de Navegação
```

## 🎨 Estilos

Todos os componentes utilizam:
- **Tailwind CSS** para estilização
- **Framer Motion** para animações
- **Lucide React** para ícones
- **Design System** consistente com cores e espaçamentos

## ♿ Acessibilidade

Todos os componentes incluem:
- Atributos ARIA apropriados
- Navegação por teclado
- Labels descritivos
- Estados de foco visíveis
- Suporte a leitores de tela

## 🚀 Melhorias Futuras

- [ ] Adicionar testes unitários
- [ ] Implementar lazy loading para componentes
- [ ] Adicionar mais animações personalizadas
- [ ] Criar temas customizáveis
- [ ] Implementar cache de estado 