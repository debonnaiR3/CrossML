import React from "react";
import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom";
import Login from "./components/login/login";
import Dashboard from './components/dashboard/dashboard';
import Register from "./components/login/register"
import ForgotPassword from "./components/login/forgotPass";
import { AuthProvider } from "./services/authContext";
import ProtectedRoute from "./components/protectedRoute";
import EmployeeDetail from "./components/dashboard/empDetails";


export default function App(){
  return (
    <AuthProvider>
      
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/login' replace/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/dashboard/:name' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/forgotPassword" element={<ForgotPassword/>}/>
        <Route path="*" element={<Navigate to="/login" replace/>}/>
        <Route path="/employee/:id" element={<ProtectedRoute><EmployeeDetail/></ProtectedRoute>}/>
      </Routes>
    </BrowserRouter>
    
    </AuthProvider>
  );
}
