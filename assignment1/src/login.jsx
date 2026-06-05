import './login.css'
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
    return (
        <div className="container">
            <div className="card">
                <div className="logocont">
                    <div className="logo"></div>
                    <h2 style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '-0.5px' }}>cross<span style={{ color: 'var(--cml-red)' }}>ml</span></h2>
                </div>

                <h1 className="title">Welcome back</h1>
                <p className="subtitle">Enter your credentials</p>
                <form onSubmit={handleLogin}>
                    <div className="formchild">
                        <label>Email</label>
                        <input type="email" placeholder="name@crossml.com" required/>

                    </div>
                    <div className="formchild">
                        <label>Password</label>
                        <input type="password" placeholder="****" required />
                    </div>
                    <button type="submit" className="btn-primary">Sign in</button>
                </form>
            </div>
        </div>
    );

}