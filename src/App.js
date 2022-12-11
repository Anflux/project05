import "./App.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/home/Home";
import Create from "./pages/create/Create";
import Search from "./pages/search/Search";
import Navbar from "./components/Navbar";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import ThemeSelector from "./components/ThemeSelector";
import Activity from "./pages/recipe/Activity";
import { AuthContext } from "./context/Auth";
import { useContext } from "react";

function App() {
  const {currentUser} = useContext(AuthContext)

  return (
    <div className="App">
        <BrowserRouter>
          <Navbar />
          <ThemeSelector />
          <Routes>
            <Route path="/" element={currentUser ? <Home /> : <Navigate to="/login"/> } />

            <Route path="/create" element={currentUser ? <Create /> : <Navigate to="/login"/>} />

            <Route path="/search" element={currentUser? <Search /> : <Navigate to="/login"/>} />

            <Route path="/activities/:id" element={!currentUser ? <Login /> : <Navigate to="/activity/:id" /> && <Activity/>} />

            <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" />} />

            <Route path="/signup" element={!currentUser ? <Signup /> : <Navigate to="/" />} />
            
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
