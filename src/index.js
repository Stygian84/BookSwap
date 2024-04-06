import React from "react";
import ReactDOM from "react-dom/client";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import "./index.css";
import LoginContent from "./pages/login.js";
import { Divider } from "@mui/material";
import { HomeContent, HomeTop } from "./pages/home.js";
import RegisterContent from "./pages/register.js";
import { ProfileContent } from "./pages/profile.js";
import { CategoryContent } from "./pages/category.js";
import DetailsContent from "./pages/details.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Top />
      <Divider className="divider" variant="middle" />
      <Content />
    </BrowserRouter>
  </React.StrictMode>
);

function Top() {
  return (
    <Routes>
      <Route path="/home" exact element={<HomeTop />} />
      <Route path="/profile" exact element={<HomeTop />} />
      <Route path="/details" exact element={<HomeTop />} />
      <Route path="/category" exact element={<HomeTop />} />
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
      <Route path="/details" exact element={<DetailsContent />} />
      <Route path="/category" exact element={<CategoryContent />} />
    </Routes>
  );
}
