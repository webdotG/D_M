import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import WelcomePage from './pages/welcome/welcomePage';
import LoginRegisterPage from './pages/login_register/loginRegisterPage';
import HomePage from './pages/home/home';
import Layout from './layout/layout';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
      <Route
        path="/D_M/welcome"
        element={!isAuthenticated ? <WelcomePage /> : <Navigate to="/D_M/" />}
      />
      <Route
        path="/D_M/login"
        element={!isAuthenticated ? <LoginRegisterPage /> : <Navigate to="/D_M/" />}
      />
      <Route
        path="/D_M/"
        element={isAuthenticated ? <Layout><HomePage /></Layout> : <Navigate to="/D_M/welcome" />}
      />
    </Routes>
  );
}

export default App;
