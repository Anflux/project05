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
import Settings from "./pages/settings/Settings";
import MyLikes from "./pages/likes/MyLikes";
import MyPosts from "./pages/posts/MyPosts";

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

            <Route path="/activities/:id" element={currentUser ? <Navigate to="/activity/:id"/> && <Activity/> :<Login />} />

            <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" />} />
            
            <Route path="/signup" element={!currentUser ? <Signup /> : <Navigate to="/" />} />

            <Route path="/settings" element={currentUser ? <Settings /> : <Navigate to="/" />} />

            <Route path="/mylikes" element={currentUser ? <MyLikes /> : <Navigate to="/" />} />

            <Route path="/myposts" element={currentUser ? <MyPosts /> : <Navigate to="/" />} />
            
          </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
