import React from "react";
import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom";
import Login from "./components/login/login";
import Dashboard from './components/dashboard/dashboard';


export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/login' replace/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/dashboard/:name' element={<Dashboard/>}/>
        <Route path="*" element={<Navigate to="/login" replace/>}/>
      </Routes>
    </BrowserRouter>
  );
}
