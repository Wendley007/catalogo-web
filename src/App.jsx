import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Rotas from "./Rotas";

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Rotas />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
