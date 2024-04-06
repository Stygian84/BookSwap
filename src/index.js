import React from 'react';
import ReactDOM from 'react-dom/client';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import './index.css';
import LoginContent from './pages/Login.js'
import { Divider } from "@mui/material";
import { HomeContent, HomeTop } from './pages/Home.js';
import RegisterContent from './pages/Register.js';
import { ProfileContent } from './pages/Profile.js';

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
      <Route path="/profile" exact element={<HomeTop />} />
    </Routes>
  );
}

function Content() {
  return (
    <Routes>
      <Route path="/" exact element={<LoginContent />} />
      <Route path="/register" exact element={<RegisterContent />} />
      <Route path="/home" exact element={<HomeContent />} />
      <Route path="/profile" exact element={<ProfileContent />} />

    </Routes>
  );
}