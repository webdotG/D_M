import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import WelcomePage from './PAGES/welcome/welcomePage';
import LoginRegisterPage from './PAGES/login_register/loginRegisterPage';
import HomePage from './PAGES/home/home';
import Layout from './layout/layout';
import AddDM from './components/dreams_memories/Add_dreams_memories';
import MyPage from './PAGES/myPage/myPage';
import VisualPage from './PAGES/visual/VisualPage';
import ThemeProvider from './layout/themeProvider';
import ChatPage from './PAGES/chat/chatPage';

function App() {
  
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <ThemeProvider >
    <Routes>
      <Route path="/D_M/welcome" element={!isAuthenticated ? <WelcomePage /> : <Navigate to="/D_M/" />} />
      <Route path="/D_M/login" element={!isAuthenticated ? <LoginRegisterPage /> : <Navigate to="/D_M/" />} />
      <Route path="/D_M/" element={isAuthenticated ? <Layout><HomePage /></Layout> : <Navigate to="/D_M/welcome" />} />
      <Route path="/D_M/add" element={isAuthenticated ?<Layout> <AddDM /> </Layout>: <Navigate to="/D_M/welcome" />} />
      <Route path="/D_M/visualPage" element={isAuthenticated ? <Layout><VisualPage/></Layout> : <Navigate to="/D_M/welcome" />} />
      <Route path="/D_M/myPage" element={isAuthenticated ? <Layout> <MyPage /> </Layout> : <Navigate to="/D_M/welcome" />} />
      <Route path="/D_M/chatPage" element={isAuthenticated ? <Layout> <ChatPage /> </Layout> : <Navigate to="/D_M/welcome" />} />
    </Routes>
    </ThemeProvider>
  );
}

export default App;
