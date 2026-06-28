import styles from './login.module.css';
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { login } from '../../redux/auth';

export default function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");

    function handleLogin(e) {
        e.preventDefault();
        setErr(""); 
        
        if (!email || !password) return;

        // Redux slices handle storage access, but for auth validation scanning we check the ledger safely
        const registeredAccounts = JSON.parse(localStorage.getItem('cml_accounts')) || [];

        const validUser = registeredAccounts.find(
            user => user.email.toLowerCase() === email.toLowerCase() && user.password === password
        );

        if (validUser) {
            const sessionData = { 
                name: validUser.name, 
                email: validUser.email,
                role: validUser.role,
                token: "cml-jwt-" + Math.random().toString(36).substring(2) 
            };
            
            dispatch(login(sessionData));
            navigate(`/dashboard/${encodeURIComponent(validUser.name)}`);
        } else {
            setErr("Invalid email or password. Please try again.");
        }
    }

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
                            type="email" className={styles.input} placeholder="name@crossml.com" 
                            required value={email} onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className={styles.formchild}>
                        <label className={styles.label}>Password</label>
                        <input 
                            type="password" className={styles.input} placeholder="••••••••" 
                            required value={password} onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {err && <p style={{ color: 'var(--cml-red)', fontSize: '13px', fontWeight: '500', marginBottom: '12px' }}>{err}</p>}

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