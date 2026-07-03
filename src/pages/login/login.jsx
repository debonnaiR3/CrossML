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
            setErr("Invalid gateway credentials. Access denied.");
        }
    }

    return (
        <div className={styles.layout}>
            
            <div className={styles.heroSection}>
                <div className={styles.heroOverlay}>
                    <div className={styles.heroContent}>
                        <div className={styles.logoBox}>❖</div>
                        <h1>cross<span style={{color: '#ea4335'}}>ml</span> Directory</h1>
                        <p>Secure authentication gateway for internal agent dossiers and system architecture records.</p>
                    </div>
                </div>
            </div>

            
            <div className={styles.formSection}>
                <div className={styles.formContainer}>
                    <h2 className={styles.title}>System Login</h2>
                    <p className={styles.subtitle}>Enter your secure credentials</p>
                    
                    <form onSubmit={handleLogin}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Email Address</label>
                            <input 
                                type="email" className={styles.input} placeholder="agent@crossml.com" 
                                required value={email} onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Passcode</label>
                            <input 
                                type="password" className={styles.input} placeholder="••••••••" 
                                required value={password} onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {err && <div className={styles.errorBanner}>⚠️ {err}</div>}

                        <button type="submit" className={`btn-primary ${styles.submitBtn}`}>Authenticate</button>
                    </form>

                    <div className={styles.footerLinks}>
                        <Link to="/forgotPassword" className={styles.link}>Forgot Passcode?</Link>
                        <p>Require clearance? <Link to="/register" className={styles.boldLink}>Register here</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}