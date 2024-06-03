import { Routes, Route } from 'react-router-dom'
import WelcomePage from './pages/welcome/welcomePage';
import LoginRegisterPage from './pages/login_register/loginRegisterPage';
import HomePage from './pages/home/home';
import Layout from './components/layout/layout';

function App() {

  return (
    <Routes>
      <Route index path="/D_M/welcome" element={<WelcomePage />} />
      <Route index path="/D_M/login" element={<LoginRegisterPage />} />
      <Route index path='/D_M/' element={<Layout><HomePage /></Layout>} />
    </Routes>
  )
}

export default App
