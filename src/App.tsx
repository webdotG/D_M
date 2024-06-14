import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from './pages/welcome/welcomePage';
import LoginRegisterPage from './pages/login_register/loginRegisterPage';
import HomePage from './pages/home/home';
import Layout from './components/layout/layout';

function App() {
  return (
    <Router basename="/D_M">
      <Routes>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login" element={<LoginRegisterPage />} />
        <Route path="/" element={<Layout><HomePage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
