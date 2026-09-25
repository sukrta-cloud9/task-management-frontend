import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Tasks from "./pages/Tasks";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
  path="/tasks"
  element={
    <ProtectedRoute>
      <Tasks />
    </ProtectedRoute>
  }
/>
        <Route
          path="/"
          element={
            <div className="min-h-screen flex items-center justify-center">
              <h1 className="text-3xl font-bold">
                Task Management App
              </h1>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;