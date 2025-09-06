import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import LandingPage from "./pages/LandingPage/LandingPage";
import DashboardLayout from "./components/dashboard/DashboardLayout";
import NewProject from "./pages/NewProject";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetail from "./pages/ProjectDetail";
const TOKEN_KEY = "jwtToken";

function App() {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // storage (other tabs)
    const onStorage = (e) => {
      if (!e.key || e.key === TOKEN_KEY) {
        setToken(localStorage.getItem(TOKEN_KEY));
      }
    };
    // custom same-tab event
    const onAuthChanged = () => setToken(localStorage.getItem(TOKEN_KEY));

    window.addEventListener("storage", onStorage);
    window.addEventListener("authChanged", onAuthChanged);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("authChanged", onAuthChanged);
    };
  }, []);

  const isAuthed = !!token;

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!isAuthed ? <Login /> : <Navigate to="/home" replace />}
        />
        <Route
          path="/signup"
          element={!isAuthed ? <Signup /> : <Navigate to="/home" replace />}
        />

        <Route path="/home" element={<LandingPage />} />

        <Route
          path="*"
          element={<Navigate to={isAuthed ? "/home" : "/login"} replace />}
        />

        <Route
          path="/dashboard/*"
          element={
            token ? (
              <DashboardLayout>
                <Routes>
                  <Route path="project/:id" element={<ProjectDetail />} />
                  <Route path="project/new" element={<NewProject />} />
                  <Route path="projects" element={<ProjectsPage />} />
                  
                  <Route path="" element={<Navigate to="projects" replace />} />
                </Routes>
              </DashboardLayout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
