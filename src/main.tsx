import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './variables.module.scss'



// import { BrowserRouter } from 'react-router-dom'
// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <BrowserRouter>
//     <App />
//   </BrowserRouter>
// )


import React from 'react';
const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  console.error('Root element not found');
}
