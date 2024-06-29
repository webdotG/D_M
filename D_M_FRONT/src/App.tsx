import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import WelcomePage from './PAGES/welcome/welcomePage';
import LoginRegisterPage from './PAGES/login_register/loginRegisterPage';
import HomePage from './PAGES/home/home';
import Layout from './layout/layout';
import instance from './axios'; 


function App() {
  // const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  // const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const response = await instance.get('/api/user/current')
  //       console.log('App setAuthenticated response:', response.data.authenticated);
  //     } catch (error) {
  //       console.error('Ошибка проверки аутентификации', error);
  //     }
  //   };
  
  //   checkAuth();
  // }, [setAuthenticated]);

  const isAuthenticated = true
  
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
