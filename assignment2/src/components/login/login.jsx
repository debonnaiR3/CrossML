import styles from './login.module.css';
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from '../../services/authContext';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); 
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function handleLogin(e) {
        e.preventDefault();
        
        if (email && password) {
            const extractedName = email.split("@")[0];
            
      
            const userData = { 
                name: extractedName, 
                email: email,
                token: "mock-jwt-token-123" 
            };
            
           
            login(userData);
            navigate(`/dashboard/${extractedName}`);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.logocont}>
                    <div className={styles.logo}></div>
                    <h2 style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '-0.5px' }}>
                        cross<span style={{ color: 'var(--cml-red)' }}>ml</span>
                    </h2>
                </div>

                <h1 className={styles.title}>Welcome back</h1>
                <p className={styles.subtitle}>Enter your credentials</p>
                
                <form onSubmit={handleLogin}>
                    <div className={styles.formchild}>
                        <label className={styles.label}>Email</label>
                        <input 
                            type="email" 
                            className={styles.input} 
                            placeholder="name@crossml.com" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className={styles.formchild}>
                        <label className={styles.label}>Password</label>
                        <input 
                            type="password" 
                            className={styles.input} 
                            placeholder="****" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className={`btn-primary ${styles.button}`}>Sign in</button>
                </form>

               
                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '14px' }}>
                    <Link to="/forgotPassword" style={{ color: 'var(--cml-gray)', textDecoration: 'none', display: 'block', marginBottom: '12px' }}>
                        Forgot Password?
                    </Link>
                    <p style={{ color: 'var(--cml-gray)' }}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--cml-dark)', fontWeight: '600', textDecoration: 'none' }}>Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}