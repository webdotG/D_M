import { useEffect} from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import WelcomePage from './PAGES/welcome/welcomePage';
import LoginRegisterPage from './PAGES/login_register/loginRegisterPage';
import HomePage from './PAGES/home/home';
import Layout from './layout/layout';
import AddDM from './components/dreams_memories/Add_dreams_memories';
// import instance from './axios';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  console.log('APP ... ISAUTH ... >>>  ... state: ', isAuthenticated);
  // const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       const response = await instance.get('/api/user/current');
  //       console.log('App setAuthenticated response:', response.status, response);
        
  //       if (response.data.token && !isAuthenticated) {
  //         setAuthenticated(true);
          
  //       } else if (!response.data.token && isAuthenticated) {
  //         setAuthenticated(false);
          
  //       }
  //     } catch (error) {
  //       console.error('Ошибка проверки аутентификации', error);
  //       setAuthenticated(false); 
        
  //     }
  //   };

  //   checkAuth();
  // }, [isAuthenticated, setAuthenticated]);

  

  return (
    <Routes>
      <Route path="/D_M/" element={isAuthenticated ? <Layout><HomePage /></Layout> : <Navigate to="/D_M/welcome" />} />
      <Route path="/D_M/welcome" element={!isAuthenticated ? <WelcomePage /> : <Navigate to="/D_M/" />} />
      <Route path="/D_M/login" element={!isAuthenticated ? <LoginRegisterPage /> : <Navigate to="/D_M/" />} />
      <Route path="/D_M/add_d-m" element={isAuthenticated ? <AddDM /> : <Navigate to="/D_M/welcome" />} />
    </Routes>
  );
}

export default App;
