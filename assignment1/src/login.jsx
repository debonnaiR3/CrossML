import React from "react";
import {useNavigate} from "react-router-dom";


export default function Login(){
    const navigate=useNavigate();

    function handleLogin(e){
        e.preventDefault();
        let auth=true;
        if(auth){

            navigate('/dashboard');
        }
    };

}