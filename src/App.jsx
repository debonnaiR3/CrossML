import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// PAGE IMPORTS
import Login from "./pages/login/login";
import Register from "./pages/login/register";
import ForgotPassword from "./pages/login/forgotPass";
import Dashboard from './pages/dashboard/dashboard';
import EmployeeDetail from "./pages/dashboard/empDetails";

// COMPONENT IMPORTS
import ProtectedRoute from "./components/protectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/login' replace/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/forgotPassword' element={<ForgotPassword/>}/>
        
        <Route path='/dashboard/:name' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
        <Route path="/employee/:id" element={<ProtectedRoute><EmployeeDetail/></ProtectedRoute>}/>
        
        <Route path="*" element={<Navigate to="/login" replace/>}/>
      </Routes>
    </BrowserRouter>
  );
}