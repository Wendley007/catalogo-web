# Como Utilizar o Componente EvaluationPopup

O componente `EvaluationPopup` foi criado para padronizar e reutilizar popups de avaliação elegantes e profissionais em todo o projeto da Feira de Buritizeiro.

## 📁 Localização

```
src/components/EvaluationPopup/
├── EvaluationPopup.jsx    # Componente principal
└── index.js              # Arquivo de exportação
```

## 🚀 Importação

```jsx
import EvaluationPopup from "../../components/EvaluationPopup";
```

## 📋 Propriedades Disponíveis

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `isOpen` | boolean | **Obrigatório** | Se o popup está aberto |
| `onClose` | Function | **Obrigatório** | Função para fechar o popup |
| `onAccept` | Function | **Obrigatório** | Função executada ao aceitar |
| `title` | string | "Avaliação do Catálogo" | Título do popup |
| `subtitle` | string | "Feira Livre de Buritizeiro" | Subtítulo do popup |
| `description` | string | Texto padrão | Descrição da avaliação |
| `terms` | Array | Array padrão | Array de termos de participação |
| `acceptText` | string | "Aceitar e Continuar" | Texto do botão de aceitar |
| `cancelText` | string | "Voltar" | Texto do botão de cancelar |
| `thankYouText` | string | "Agradecemos sua participação!" | Texto de agradecimento |
| `headerGradient` | string | Gradiente elegante | Gradiente do cabeçalho |
| `termsGradient` | string | Gradiente suave | Gradiente dos termos |
| `acceptButtonClass` | string | "" | Classe CSS para botão de aceitar |
| `cancelButtonClass` | string | "" | Classe CSS para botão de cancelar |
| `size` | string | "lg" | Tamanho do popup ('sm', 'md', 'lg') |

## 🎨 Melhorias Elegantes e Profissionais

### **Design Moderno**
- ✅ **Gradientes sofisticados** - Cabeçalho com gradiente emerald-teal
- ✅ **Elementos decorativos** - Círculos e formas geométricas sutis
- ✅ **Sombras e profundidade** - Shadow-2xl para elevação
- ✅ **Bordas arredondadas** - Rounded-2xl para modernidade
- ✅ **Backdrop blur** - Efeito de desfoque profissional

### **Animações Avançadas**
- ✅ **Spring animations** - Movimento natural e suave
- ✅ **Staggered animations** - Termos aparecem sequencialmente
- ✅ **Hover effects** - Interações responsivas
- ✅ **Scale animations** - Botões com feedback visual
- ✅ **Rotation effects** - Ícone de fechar com rotação

### **Ícones Contextuais**
- ✅ **Shield** - Para segurança e confidencialidade
- ✅ **Users** - Para participação e comunidade
- ✅ **Clock** - Para tempo e voluntariedade
- ✅ **Heart** - Para ética e cuidado

## 🎯 Exemplos de Uso

### **Uso Básico Elegante**
```jsx
const [showEvaluationPopup, setShowEvaluationPopup] = useState(false);

const handleEvaluationAccept = () => {
  // Lógica para aceitar avaliação
  setShowEvaluationPopup(false);
  // Redirecionar para avaliação ou executar ação
};

<EvaluationPopup
  isOpen={showEvaluationPopup}
  onClose={() => setShowEvaluationPopup(false)}
  onAccept={handleEvaluationAccept}
/>
```

### **Uso Personalizado Profissional**
```jsx
<EvaluationPopup
  isOpen={showEvaluationPopup}
  onClose={() => setShowEvaluationPopup(false)}
  onAccept={handleEvaluationAccept}
  title="Pesquisa de Satisfação"
  subtitle="Sua opinião é importante"
  description="Estamos realizando uma pesquisa para melhorar nossos serviços."
  terms={[
    "Sua participação é totalmente voluntária.",
    "Os dados coletados são confidenciais.",
    "Você pode desistir a qualquer momento.",
    "Não há riscos associados à participação.",
  ]}
  acceptText="Participar da Pesquisa"
  cancelText="Não, obrigado"
  thankYouText="Obrigado por considerar participar!"
  size="lg"
/>
```

### **Uso com Tamanhos Diferentes**
```jsx
// Pequeno - Para informações rápidas
<EvaluationPopup size="sm" />

// Médio - Para conteúdo padrão
<EvaluationPopup size="md" />

// Grande - Para conteúdo detalhado (padrão)
<EvaluationPopup size="lg" />
```

## 🎨 Funcionalidades Automáticas

### **Animações Profissionais**
- Entrada e saída suaves com spring animation
- Scale animation com damping otimizado
- Backdrop blur com overlay animado
- Staggered animations para termos
- Hover effects responsivos

### **Acessibilidade Avançada**
- Botão de fechar com aria-label
- Estrutura semântica adequada
- Suporte a navegação por teclado
- Contraste otimizado
- Foco gerenciado

### **Responsividade Elegante**
- Adaptação para diferentes telas
- Layout flexível e moderno
- Botões empilhados em mobile
- Espaçamento responsivo
- Tipografia adaptativa

### **Estrutura Visual Profissional**
- Cabeçalho com gradiente sofisticado
- Seção de termos com ícones contextuais
- Botões com gradientes e sombras
- Elementos decorativos sutis
- Barra de decoração inferior

## 🔧 Casos de Uso Comuns

### **1. Avaliação de Produto Profissional**
```jsx
<EvaluationPopup
  isOpen={showEvaluationPopup}
  onClose={() => setShowEvaluationPopup(false)}
  onAccept={() => {
    // Redirecionar para formulário de avaliação
    window.open('/avaliacao', '_blank');
    setShowEvaluationPopup(false);
  }}
  title="Avalie Nossa Experiência"
  subtitle="Sua opinião nos ajuda a melhorar"
  description="Gostaríamos de saber sua opinião sobre nossa plataforma."
  size="lg"
/>
```

### **2. Pesquisa de Mercado Elegante**
```jsx
<EvaluationPopup
  isOpen={showSurveyPopup}
  onClose={() => setShowSurveyPopup(false)}
  onAccept={() => {
    // Executar pesquisa
    startSurvey();
    setShowSurveyPopup(false);
  }}
  title="Pesquisa de Mercado"
  subtitle="Ajude-nos a conhecer melhor nossos clientes"
  terms={[
    "Dados anônimos e confidenciais.",
    "Tempo estimado: 5 minutos.",
    "Participação totalmente voluntária.",
    "Resultados para melhorias internas.",
  ]}
  size="md"
/>
```

### **3. Feedback de Usabilidade Moderno**
```jsx
<EvaluationPopup
  isOpen={showFeedbackPopup}
  onClose={() => setShowFeedbackPopup(false)}
  onAccept={() => {
    // Abrir formulário de feedback
    openFeedbackForm();
    setShowFeedbackPopup(false);
  }}
  title="Feedback de Usabilidade"
  subtitle="Ajude-nos a melhorar a experiência"
  description="Sua opinião sobre a usabilidade do site é muito importante para nós."
  size="lg"
/>
```

## 🎨 Personalização Avançada

### **Gradientes Elegantes**
```jsx
// Gradiente padrão (emerald-teal)
headerGradient="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700"

// Gradiente azul profissional
headerGradient="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"

// Gradiente rosa moderno
headerGradient="bg-gradient-to-br from-pink-600 via-rose-600 to-red-700"

// Gradiente dourado premium
headerGradient="bg-gradient-to-br from-amber-600 via-yellow-600 to-orange-700"
```

### **Termos Personalizados com Ícones**
```jsx
const customTerms = [
  "Sua participação é totalmente voluntária.",
  "Os dados coletados são confidenciais.",
  "Você pode desistir a qualquer momento.",
  "Não há riscos associados à participação.",
  "Os resultados são usados apenas para melhorias.",
];

<EvaluationPopup
  terms={customTerms}
  // ... outras props
/>
```

### **Botões Customizados Elegantes**
```jsx
<EvaluationPopup
  acceptButtonClass="px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full font-bold transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-xl"
  cancelButtonClass="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium transition-all duration-300 hover:shadow-md"
  // ... outras props
/>
```

## 📱 Responsividade Profissional

O componente é totalmente responsivo e elegante:

- **Mobile**: Layout otimizado, botões empilhados, padding reduzido
- **Desktop**: Tamanho completo, melhor espaçamento, elementos decorativos
- **Tablet**: Intermediário entre mobile e desktop, layout adaptativo

## 🚨 Tratamento de Erros Elegante

O componente trata automaticamente:

- **Props inválidas**: Usa valores padrão elegantes
- **Arrays vazios**: Renderiza lista vazia com animação
- **Funções não definidas**: Previne erros de console
- **Estados de loading**: Animações suaves

## 📋 Checklist de Implementação

Para usar o componente `EvaluationPopup`:

- [ ] Importar o componente
- [ ] Configurar estado do popup
- [ ] Criar funções de abertura/fechamento
- [ ] Definir função de aceitação
- [ ] Personalizar conteúdo se necessário
- [ ] Escolher tamanho apropriado
- [ ] Testar responsividade
- [ ] Verificar acessibilidade
- [ ] Testar animações

## 🔄 Migração de Código Existente

Para migrar código existente:

1. **Substituir o JSX do popup** pelo componente `EvaluationPopup`
2. **Configurar estado** com as propriedades necessárias
3. **Criar funções** de abertura, fechamento e aceitação
4. **Remover código duplicado** de animações e estilos
5. **Testar funcionalidades** específicas

## 📈 Benefícios

- ✅ **Design elegante e profissional** com gradientes modernos
- ✅ **Animações suaves e naturais** com spring physics
- ✅ **Ícones contextuais** para melhor compreensão
- ✅ **Responsividade avançada** para todos os dispositivos
- ✅ **Acessibilidade completa** com navegação por teclado
- ✅ **Performance otimizada** com animações eficientes
- ✅ **Código reutilizável** e padronizado
- ✅ **Manutenção simplificada** com props configuráveis
- ✅ **Consistência visual** em todo o projeto
- ✅ **Experiência do usuário** aprimorada 