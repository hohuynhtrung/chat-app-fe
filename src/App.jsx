import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./components/AppRoutes";
import { ThemeLayout } from "./components/ThemeLayout";

function App() {
  return (
    <BrowserRouter>
      <ThemeLayout>
        <AppRoutes />
      </ThemeLayout>
    </BrowserRouter>
  );
}

export default App;
