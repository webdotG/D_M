import { useEffect} from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import WelcomePage from './PAGES/welcome/welcomePage';
import LoginRegisterPage from './PAGES/login_register/loginRegisterPage';
import HomePage from './PAGES/home/home';
import Layout from './layout/layout';
import AddDM from './components/dreams_memories/Add_dreams_memories';
import MyPage from './PAGES/myPage/myPage';


function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  console.log('APP ... >>>  ... state.isAuth: ', isAuthenticated);

  return (
    <Routes>
      <Route path="/D_M/welcome" element={!isAuthenticated ? <WelcomePage /> : <Navigate to="/D_M/" />} />
      <Route path="/D_M/login" element={!isAuthenticated ? <LoginRegisterPage /> : <Navigate to="/D_M/" />} />
      <Route path="/D_M/" element={isAuthenticated ? <Layout><HomePage /></Layout> : <Navigate to="/D_M/welcome" />} />
      <Route path="/D_M/add" element={isAuthenticated ? <AddDM /> : <Navigate to="/D_M/welcome" />} />
      <Route path="/D_M/myPage" element={isAuthenticated ? <MyPage /> : <Navigate to="/D_M/welcome" />} />
    </Routes>
  );
}

export default App;
