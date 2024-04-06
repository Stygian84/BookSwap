import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {LoginContent} from './pages/Login.js'
import { Divider } from "@mui/material";
import { HomeTop } from './pages/Home.js';
import RegisterContent from './pages/Register.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Top />
        <Divider className="divider" variant="middle" />
      <Content />
    </BrowserRouter>
  </React.StrictMode>
);

function Top(){
  return (
    <Routes>
      <Route path="/home" exact element={<HomeTop />} />
    </Routes>
  );
}

function Content() {
  return (
    <Routes>
      <Route path="/" exact element={<LoginContent />} />
      <Route path="/register" exact element={<RegisterContent />} />
    </Routes>
  );
}