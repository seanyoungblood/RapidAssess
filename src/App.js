import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import NavBar from "./NavBar";
import Menu from "./Menu";
import Login from "./Login";
import SignUp from "./SignUp";
import HomePage from "./HomePage"; 
import Settings from "./UserSettings";

function getToken() {
  return sessionStorage.getItem("userToken");
}

function App() {
  const token = getToken();
  return (
    <>
      <Router>
        {token && <NavBar />}
        <Routes>
          <Route
            path="/"
            element={token ? <HomePage /> : <Navigate replace to="/login" />}
          />
          <Route
            path="/login"
            element={!token ? <Login /> : <Navigate replace to="/" />}
          />
          <Route
            path="/signup"
            element={!token ? <SignUp /> : <Navigate replace to="/" />}
          />
          <Route
            path="/home"
            element={<HomePage />}
          />
          <Route
            path="/settings"
            element={token ? <Settings /> : <Navigate replace to="/" />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
