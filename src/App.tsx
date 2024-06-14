import { Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/welcome/welcomePage';
import LoginRegisterPage from './pages/login_register/loginRegisterPage';
import HomePage from './pages/home/home';
import Layout from './layout/layout';

function App() {
  return (
      <Routes>
        <Route path="/D_M/welcome" element={<WelcomePage />} />
        <Route path="/D_M/login" element={<LoginRegisterPage />} />
        <Route path="/D_M/" element={<Layout><HomePage /></Layout>} />
      </Routes>
  );
}

export default App;
