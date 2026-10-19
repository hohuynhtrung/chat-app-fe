import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./components/AppRoutes";
import { ThemeLayout } from "./components/ThemeLayout";
import AuthProvider from "@/components/AuthProvider";

function App() {
  return (
    <BrowserRouter>
      <ThemeLayout>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeLayout>
    </BrowserRouter>
  );
}

export default App;
